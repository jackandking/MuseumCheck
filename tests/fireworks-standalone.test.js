/**
 * Tests for Standalone Fireworks Page (fireworks.html)
 * Ensures the standalone fireworks page works independently
 */

const fs = require('fs');
const path = require('path');

describe('Standalone Fireworks Page', () => {
    let fireworksHtml;
    let fireworkJs;

    beforeAll(() => {
        fireworksHtml = fs.readFileSync(path.join(__dirname, '..', 'fireworks.html'), 'utf8');
        fireworkJs = fs.readFileSync(path.join(__dirname, '..', 'firework.js'), 'utf8');
    });

    describe('HTML Structure', () => {
        test('should have proper HTML structure', () => {
            expect(fireworksHtml).toContain('<!DOCTYPE html>');
            expect(fireworksHtml).toContain('<html lang="zh-CN">');
            expect(fireworksHtml).toContain('<canvas id="canvas">');
        });

        test('should load firework.js correctly', () => {
            expect(fireworksHtml).toContain('<script src="firework.js">');
            expect(fireworksHtml).not.toContain('../util.js');
            expect(fireworksHtml).not.toContain('../firework.js');
        });

        test('should have initialization script', () => {
            expect(fireworksHtml).toContain('FireworksCanvasSystem');
            expect(fireworksHtml).toContain('launchRandomFirework');
            expect(fireworksHtml).toContain('DOMContentLoaded');
        });

        test('should have proper title and branding', () => {
            expect(fireworksHtml).toContain('互联网烟花 - MuseumCheck');
            expect(fireworksHtml).toContain('🎆 MuseumCheck 烟花秀 🎆');
        });

        test('should have customize button', () => {
            expect(fireworksHtml).toContain('class="customize-btn"');
            expect(fireworksHtml).toContain('定制');
        });
    });

    describe('Firework.js Module', () => {
        test('should export FireworksCanvasSystem class', () => {
            expect(fireworkJs).toContain('class FireworksCanvasSystem');
            expect(fireworkJs).toContain('constructor(canvas)');
        });

        test('should export Rocket class', () => {
            expect(fireworkJs).toContain('class Rocket');
            expect(fireworkJs).toContain('constructor(x, startY, targetY, color');
        });

        test('should export Particle class', () => {
            expect(fireworkJs).toContain('class Particle');
            expect(fireworkJs).toContain('constructor(x, y, angle, speed, color');
        });

        test('should have animation methods', () => {
            expect(fireworkJs).toContain('start()');
            expect(fireworkJs).toContain('stop()');
            expect(fireworkJs).toContain('animate()');
            expect(fireworkJs).toContain('launchFirework');
        });

        test('should have explosion logic', () => {
            expect(fireworkJs).toContain('createExplosion');
            expect(fireworkJs).toContain('getRandomFireworkColors');
        });

        test('should have proper color schemes', () => {
            expect(fireworkJs).toContain('#FF1744'); // Red
            expect(fireworkJs).toContain('#00E676'); // Green
            expect(fireworkJs).toContain('#2979FF'); // Blue
            expect(fireworkJs).toContain('#E040FB'); // Purple
        });

        test('should have physics simulation', () => {
            expect(fireworkJs).toContain('gravity');
            expect(fireworkJs).toContain('Air resistance');
            expect(fireworkJs).toContain('decay');
        });
    });

    describe('Functionality', () => {
        test('should auto-launch fireworks on page load', () => {
            expect(fireworksHtml).toContain('launchRandomFirework()');
            expect(fireworksHtml).toContain('setTimeout(launchRandomFirework');
        });

        test('should support click-to-launch', () => {
            expect(fireworksHtml).toContain('canvas.addEventListener(\'click\'');
            expect(fireworksHtml).toContain('new Rocket');
        });

        test('should have responsive canvas sizing', () => {
            expect(fireworksHtml).toContain('resizeCanvas()');
            expect(fireworksHtml).toContain('window.innerWidth');
            expect(fireworksHtml).toContain('window.innerHeight');
        });

        test('should have random labels and nicknames', () => {
            expect(fireworksHtml).toContain('博物馆探索');
            expect(fireworksHtml).toContain('亲子时光');
            expect(fireworksHtml).toContain('小朋友');
        });
    });

    describe('Styling', () => {
        test('should have dark background theme', () => {
            expect(fireworksHtml).toContain('background: #0a0e27');
            expect(fireworksHtml).toContain('overflow: hidden');
        });

        test('should have styled customize button', () => {
            expect(fireworksHtml).toContain('rgba(255, 255, 255, 0.2)');
            expect(fireworksHtml).toContain('backdrop-filter: blur');
        });

        test('should have info banner styling', () => {
            expect(fireworksHtml).toContain('class="info-text"');
            expect(fireworksHtml).toContain('fadeIn');
        });
    });

    describe('Code Quality', () => {
        test('firework.js should not have dependencies on main app', () => {
            expect(fireworkJs).not.toContain('MuseumCheckApp');
            expect(fireworkJs).not.toContain('MUSEUMS');
            expect(fireworkJs).not.toContain('localStorage');
        });

        test('should have proper comments', () => {
            expect(fireworkJs).toContain('/**');
            expect(fireworkJs).toContain('Fireworks Animation System');
        });

        test('should be standalone and modular', () => {
            // Verify no external dependencies
            expect(fireworkJs).not.toContain('import');
            expect(fireworkJs).not.toContain('require');
        });
    });
});
