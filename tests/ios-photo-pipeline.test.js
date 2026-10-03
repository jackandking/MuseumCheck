/**
 * @jest-environment jsdom
 *
 * Regression guard for the iPhone check-in photo bug (reported at 南京博物院):
 * picking a photo in the task dialog must NEVER leave the check-in stuck.
 *
 * The old pipeline hung silently when the browser could not decode the picked
 * photo (iPhone HEIC shots): `img.onload` was awaited with no error/timeout
 * path, so the promise never settled - no preview, no error, no way forward.
 * The user's only escape was to give up the photo and finish the task without
 * one. These tests pin the contract: decoding always settles, fast.
 */

const { describe, test, expect, beforeEach, afterEach } = require('@jest/globals');

const { compressToJpeg, decodeImageSource } = require('../js/image-upload-util.js');

const REAL_CREATE_IMAGE_BITMAP = global.createImageBitmap;
const REAL_IMAGE = global.Image;

/** Minimal JPEG payload so callers that inspect bytes stay realistic. */
const JPEG_BYTES = Buffer.from(
    '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8' +
    'UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAAB' +
    'AAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==',
    'base64'
);

function makeFile(name = 'IMG_0001.HEIC', type = 'image/heic') {
    return new File([JPEG_BYTES], name, { type });
}

/** Install an <Image> fake whose decode settles (ok or failed) after `delayMs`. */
function installImageFake({ ok, width = 4000, height = 3000, delayMs = 5 }) {
    global.Image = class {
        constructor() { this.onload = null; this.onerror = null; }
        set src(_) {
            setTimeout(() => {
                if (ok) {
                    this.width = width;
                    this.height = height;
                    if (this.onload) this.onload();
                } else if (this.onerror) {
                    this.onerror(new Error('decode failed'));
                }
            }, delayMs);
        }
    };
}

beforeEach(() => {
    if (!URL.createObjectURL) URL.createObjectURL = jest.fn(() => 'blob:mock');
    if (!URL.revokeObjectURL) URL.revokeObjectURL = jest.fn();
    jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
});

afterEach(() => {
    if (REAL_CREATE_IMAGE_BITMAP) global.createImageBitmap = REAL_CREATE_IMAGE_BITMAP;
    else delete global.createImageBitmap;
    global.Image = REAL_IMAGE;
    jest.restoreAllMocks();
});

describe('image decode pipeline (iPhone / HEIC robustness)', () => {
    test('rejects instead of hanging when the image cannot be decoded', async () => {
        global.createImageBitmap = async () => { throw new Error('The source image could not be decoded.'); };
        installImageFake({ ok: false });

        await expect(compressToJpeg(makeFile())).rejects.toThrow(/无法解码该图片/);
    });

    test('rejects instead of hanging when the decoder never calls back', async () => {
        // Neither onload nor onerror ever fires (old WebViews / wedged decoders).
        global.createImageBitmap = async () => { throw new Error('unsupported'); };
        global.Image = class { set src(_) { /* silence forever */ } };

        await expect(
            compressToJpeg(makeFile(), { decodeTimeoutMs: 50 })
        ).rejects.toThrow(/解码超时/);
    }, 10000);

    test('falls back to an <img> element when createImageBitmap is unavailable', async () => {
        delete global.createImageBitmap;
        installImageFake({ ok: true, width: 4000, height: 3000 });

        const src = await decodeImageSource(makeFile('IMG_0001.jpg', 'image/jpeg'));
        expect(src.width).toBe(4000);
        expect(src.height).toBe(3000);
    });

    test('compresses to JPEG and scales oversized photos down', async () => {
        const captured = {};
        global.createImageBitmap = async () => ({
            width: 4000, height: 3000, close() {},
        });

        const ctx2d = {
            imageSmoothingEnabled: false,
            imageSmoothingQuality: '',
            drawImage: jest.fn(),
        };
        const drawSpy = jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function () {
            captured.width = this.width;
            captured.height = this.height;
            return ctx2d;
        });
        const blobSpy = jest.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(function (cb) {
            cb(new Blob([JPEG_BYTES], { type: 'image/jpeg' }));
        });

        try {
            const blob = await compressToJpeg(makeFile('IMG_0001.jpg', 'image/jpeg'), { maxWidth: 1200, maxHeight: 1200, quality: 0.85 });
            expect(blob.type).toBe('image/jpeg');
            // 4000x3000 scaled to fit 1200x1200 -> 1200x900
            expect(captured).toEqual({ width: 1200, height: 900 });
            expect(ctx2d.drawImage).toHaveBeenCalledTimes(1);
        } finally {
            drawSpy.mockRestore();
            blobSpy.mockRestore();
        }
    });
});
