(function(root, factory) {
    'use strict';
    const api = factory(root);
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }
    if (root) {
        root.MuseumCheckPilot = api;
    }
})(typeof window !== 'undefined' ? window : null, function(root) {
    'use strict';

    const STORAGE_KEY = 'museumcheckPilotContext:v1';
    const SIGNAL_KEY = 'museumcheck-visit-signals';
    const SIGNAL_TTL_SECONDS = 90 * 24 * 60 * 60;
    const AGE_VALUES = ['3-6', '7-12', '13-18'];
    const FORMAT_VALUES = ['family', 'camp', 'school', 'friends'];
    const GROUP_VALUES = ['2-3', '4-8', '9-20', '21-plus'];
    const DURATION_VALUES = ['under-60', '60-90', '90-120', '120-plus'];
    const COHORT_PATTERN = /^[a-z0-9][a-z0-9-]{0,39}$/;
    const SESSION_PATTERN = /^pilot-[a-z0-9-]{8,80}$/;
    const COHORTS = {
        'one-camp': {
            name: '一初夏令营共创试用',
            inviteLine: '给一初夏令营的一张现场任务卡',
            summary: '不用安装，不用注册。先按真实活动准备，到馆后完成第 1 个任务，再告诉我们哪里顺、哪里不顺。'
        }
    };

    function allowed(value, values, fallback) {
        return values.includes(value) ? value : fallback;
    }

    function normalizeCohort(value) {
        const normalized = String(value || '').trim().toLowerCase();
        return COHORT_PATTERN.test(normalized) ? normalized : 'early-family';
    }

    function createSessionId(now, randomValue) {
        const timestamp = Number.isFinite(now) ? now : Date.now();
        const randomPart = typeof randomValue === 'string'
            ? randomValue
            : Math.random().toString(36).slice(2, 10);
        return `pilot-${timestamp}-${randomPart.replace(/[^a-z0-9]/gi, '').slice(0, 12) || 'session'}`;
    }

    function normalizePilotContext(context) {
        const input = context || {};
        const pilotSessionId = SESSION_PATTERN.test(String(input.pilotSessionId || ''))
            ? String(input.pilotSessionId)
            : createSessionId();

        return {
            version: 1,
            cohort: normalizeCohort(input.cohort),
            pilotSessionId,
            age: allowed(input.age, AGE_VALUES, '7-12'),
            museumId: String(input.museumId || '').trim().slice(0, 80),
            museumName: String(input.museumName || '').trim().slice(0, 120),
            city: String(input.city || '').trim().slice(0, 80),
            format: allowed(input.format, FORMAT_VALUES, 'family'),
            group: allowed(input.group, GROUP_VALUES, '2-3'),
            duration: allowed(input.duration, DURATION_VALUES, '60-90'),
            savedAt: Number.isFinite(input.savedAt) ? input.savedAt : Date.now()
        };
    }

    function museumLabel(museum) {
        return `${museum.name}｜${museum.location}`;
    }

    function resolveMuseum(value, museums) {
        const query = String(value || '').trim().toLowerCase();
        if (!query || !Array.isArray(museums)) return null;

        return museums.find(museum => {
            if (!museum || !museum.id || !museum.name) return false;
            return String(museum.id).toLowerCase() === query ||
                String(museum.name).toLowerCase() === query ||
                museumLabel(museum).toLowerCase() === query;
        }) || null;
    }

    function buildCheckinUrl(context) {
        const normalized = normalizePilotContext(context);
        if (!normalized.museumId) return '';

        const params = new URLSearchParams({
            museum: normalized.museumId,
            age: normalized.age,
            pilot: normalized.cohort,
            pilotSession: normalized.pilotSessionId,
            format: normalized.format,
            group: normalized.group,
            duration: normalized.duration
        });
        return `museum-checkin.html?${params.toString()}`;
    }

    function getCohortConfig(cohort) {
        return COHORTS[normalizeCohort(cohort)] || {
            name: 'MuseumCheck 早期共创试用',
            inviteLine: '给这次真实参观的一张任务卡',
            summary: '不用安装，不用注册。到馆后打开第 1 个任务，完成后告诉我们这一步有没有帮助。'
        };
    }

    function sendSignal(signalType, context, extra) {
        if (!root || typeof root.fetch !== 'function') return Promise.resolve();
        const endpoint = root.API_ENDPOINTS && root.API_ENDPOINTS.KV_STORE;
        if (!endpoint) return Promise.resolve();

        const normalized = normalizePilotContext(context);
        const timestamp = Date.now();
        const payload = {
            type: 'visit_signal',
            signalType,
            page: 'pilot',
            pilotContext: {
                cohort: normalized.cohort,
                pilotSessionId: normalized.pilotSessionId,
                age: normalized.age,
                museumId: normalized.museumId,
                city: normalized.city,
                format: normalized.format,
                group: normalized.group,
                duration: normalized.duration
            },
            timestamp,
            parameters: extra || {}
        };
        const body = JSON.stringify({
            key: SIGNAL_KEY,
            sortKey: `${signalType}-${normalized.pilotSessionId}-${timestamp}`,
            value: JSON.stringify(payload),
            expireAt: Math.floor(timestamp / 1000) + SIGNAL_TTL_SECONDS
        });

        return root.fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: body.length < 60000
        }).catch(function(error) {
            console.warn('[Pilot] Anonymous signal failed:', error);
        });
    }

    function initializePage() {
        if (!root || !root.document) return;
        const document = root.document;
        const params = new URLSearchParams(root.location.search);
        const cohort = normalizeCohort(params.get('pilot'));
        const config = getCohortConfig(cohort);
        const museums = Array.isArray(root.MUSEUMS_META) ? root.MUSEUMS_META : [];
        const sessionId = createSessionId();
        const baseContext = normalizePilotContext({ cohort, pilotSessionId: sessionId });
        const form = document.getElementById('pilotForm');
        const museumInput = document.getElementById('museumInput');
        const datalist = document.getElementById('museumOptions');
        const error = document.getElementById('pilotError');

        document.title = `${config.name}｜MuseumCheck`;
        const inviteLine = document.getElementById('pilotInviteLine');
        const summary = document.getElementById('pilotSummary');
        if (inviteLine) inviteLine.textContent = config.inviteLine;
        if (summary) summary.textContent = config.summary;

        if (datalist) {
            const fragment = document.createDocumentFragment();
            museums.forEach(function(museum) {
                if (!museum || !museum.id || !museum.name || !museum.location) return;
                const option = document.createElement('option');
                option.value = museumLabel(museum);
                fragment.appendChild(option);
            });
            datalist.appendChild(fragment);
        }

        sendSignal('pilot_open', baseContext, { museumOptionCount: museums.length });

        if (!form || !museumInput) return;
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (error) error.hidden = true;

            const museum = resolveMuseum(museumInput.value, museums);
            if (!museum) {
                if (error) {
                    error.textContent = '请从建议中选择一个具体博物馆，这样我们才能打开对应的现场任务。';
                    error.hidden = false;
                }
                museumInput.focus();
                return;
            }

            const formData = new FormData(form);
            const context = normalizePilotContext({
                cohort,
                pilotSessionId: sessionId,
                age: formData.get('age'),
                museumId: museum.id,
                museumName: museum.name,
                city: museum.location,
                format: formData.get('format'),
                group: formData.get('group'),
                duration: formData.get('duration')
            });

            try {
                root.localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
                root.localStorage.setItem('ageGroup', context.age);
            } catch (storageError) {
                console.warn('[Pilot] Could not save local context:', storageError);
            }

            const target = buildCheckinUrl(context);
            sendSignal('pilot_started', context, { target: 'museum-checkin' });
            root.location.assign(target);
        });
    }

    if (root && root.document) {
        if (root.document.readyState === 'loading') {
            root.document.addEventListener('DOMContentLoaded', initializePage, { once: true });
        } else {
            initializePage();
        }
    }

    return {
        STORAGE_KEY,
        normalizeCohort,
        normalizePilotContext,
        createSessionId,
        resolveMuseum,
        buildCheckinUrl,
        getCohortConfig,
        museumLabel
    };
});
