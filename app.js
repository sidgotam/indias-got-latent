/**
 * INDIA'S GOT LATENT (IGL) STREAM - High-Performance Platform Engine
 * 
 * Features & Optimizations:
 * - Direct UPI Payment App Redirect (GPay, PhonePe, Paytm, BHIM)
 * - Single Reusable Cinema Video Player with memory release
 * - Event Delegation across slider tracks
 * - In-Place Micro-DOM updates for Watched states
 * - RequestAnimationFrame-throttled slider dragging
 * - Pre-indexed multi-field search with 120ms debounce
 * - DocumentFragment batch rendering
 * - Explicit width/height on card thumbnails
 */

(function () {
    'use strict';

    // =========================================================================
    // STATE & STORAGE
    // =========================================================================
    const STORAGE_KEYS = {
        EPISODES: 'igl_stream_episodes_v9',
        WATCHED: 'igl_stream_watched_v1',
        MASTER_FOLDER: 'igl_stream_master_folder_v1'
    };

    let episodes = [];
    let currentPlayingEpisodeId = null;
    let pendingEpisodeIdToPlay = null;
    let watchedEpisodes = new Set();
    let currentAdminSeason = '1';
    let searchDebounceTimer = null;
    let videoLoadTimeoutTimer = null;
    let selectedChaiAmount = '20';

    // DOM Elements Cache
    const DOM = {
        season1Track: document.getElementById('season1Track'),
        season2Track: document.getElementById('season2Track'),
        vipTrack: document.getElementById('vipTrack'),
        searchTrack: document.getElementById('searchTrack'),
        searchSection: document.getElementById('searchSection'),
        searchResultQueryText: document.getElementById('searchResultQueryText'),
        searchResultCountText: document.getElementById('searchResultCountText'),
        resetSearchBtn: document.getElementById('resetSearchBtn'),
        s1SliderCounter: document.getElementById('s1SliderCounter'),
        s2SliderCounter: document.getElementById('s2SliderCounter'),
        vipSliderCounter: document.getElementById('vipSliderCounter'),

        // Nav and search
        navLinks: document.querySelectorAll('.nav-links .nav-link'),
        searchInput: document.getElementById('searchInput'),
        clearSearchBtn: document.getElementById('clearSearchBtn'),
        statsWatched: document.getElementById('statsWatched'),
        navSupportBtn: document.getElementById('navSupportBtn'),
        navDriveFolderBtn: document.getElementById('navDriveFolderBtn'),

        // Hero CTA Buttons
        heroPlayS1Btn: document.getElementById('heroPlayS1Btn'),
        heroPlayS2Btn: document.getElementById('heroPlayS2Btn'),
        heroVipBtn: document.getElementById('heroVipBtn'),
        heroDriveFolderBtn: document.getElementById('heroDriveFolderBtn'),

        // Developer Contribution / Buy Chai QR Modal
        donateModal: document.getElementById('donateModal'),
        donateBackdrop: document.getElementById('donateBackdrop'),
        closeDonateBtn: document.getElementById('closeDonateBtn'),
        donateEpisodeTitle: document.getElementById('donateEpisodeTitle'),
        developerQrImg: document.getElementById('developerQrImg'),
        upiIdText: document.getElementById('upiIdText'),
        copyUpiBtn: document.getElementById('copyUpiBtn'),
        copyBtnText: document.getElementById('copyBtnText'),
        chaiTierBtns: document.querySelectorAll('.chai-tier-btn'),
        upiIntentLinks: document.querySelectorAll('.upi-intent-link'),
        payViaUpiAppBtn: document.getElementById('payViaUpiAppBtn'),
        payTierAmountDisplay: document.getElementById('payTierAmountDisplay'),
        donateContributedBtn: document.getElementById('donateContributedBtn'),
        donateContinueBtn: document.getElementById('donateContinueBtn'),
        footerSupportLink: document.getElementById('footerSupportLink'),

        // Player Modal
        playerModal: document.getElementById('playerModal'),
        playerBackdrop: document.getElementById('playerBackdrop'),
        closePlayerBtn: document.getElementById('closePlayerBtn'),
        driveVideoIframe: document.getElementById('driveVideoIframe'),
        playerEpisodeTag: document.getElementById('playerEpisodeTag'),
        playerEpisodeTitle: document.getElementById('playerEpisodeTitle'),
        videoWrapper: document.getElementById('videoWrapper'),
        fullscreenPlayerBtn: document.getElementById('fullscreenPlayerBtn'),
        toggleTheaterBtn: document.getElementById('toggleTheaterBtn'),
        prevEpisodeBtn: document.getElementById('prevEpisodeBtn'),
        nextEpisodeBtn: document.getElementById('nextEpisodeBtn'),
        markWatchedBtn: document.getElementById('markWatchedBtn'),
        markWatchedText: document.getElementById('markWatchedText'),
        toggleEpisodeListBtn: document.getElementById('toggleEpisodeListBtn'),
        playerEpisodeDrawer: document.getElementById('playerEpisodeDrawer'),
        closeDrawerBtn: document.getElementById('closeDrawerBtn'),
        drawerEpisodeList: document.getElementById('drawerEpisodeList'),
        sampleNoticeBanner: document.getElementById('sampleNoticeBanner'),
        autoNextCheck: document.getElementById('autoNextCheck'),
        videoErrorOverlay: document.getElementById('videoErrorOverlay'),
        retryVideoBtn: document.getElementById('retryVideoBtn'),
        unloadedNoticeOverlay: document.getElementById('unloadedNoticeOverlay'),
        unloadedTitle: document.getElementById('unloadedTitle'),
        unloadedBackBtn: document.getElementById('unloadedBackBtn'),

        // Admin Modal
        adminModal: document.getElementById('adminModal'),
        adminModalBtn: document.getElementById('adminModalBtn'),
        adminBackdrop: document.getElementById('adminBackdrop'),
        closeAdminBtn: document.getElementById('closeAdminBtn'),
        cancelAdminBtn: document.getElementById('cancelAdminBtn'),
        saveAllLinksBtn: document.getElementById('saveAllLinksBtn'),
        resetDataBtn: document.getElementById('resetDataBtn'),
        exportDataBtn: document.getElementById('exportDataBtn'),
        adminTabs: document.querySelectorAll('.admin-tab'),
        adminFilterInput: document.getElementById('adminFilterInput'),
        adminEpisodesList: document.getElementById('adminEpisodesList'),
        masterDriveFolderInput: document.getElementById('masterDriveFolderInput'),
        applyFolderToAllBtn: document.getElementById('applyFolderToAllBtn'),
        openMasterDriveBtn: document.getElementById('openMasterDriveBtn'),
        masterFolderIdBadge: document.getElementById('masterFolderIdBadge'),

        // Footer links
        footerAdminLink: document.getElementById('footerAdminLink'),
        footerResetLink: document.getElementById('footerResetLink'),
        toastContainer: document.getElementById('toastContainer')
    };

    // =========================================================================
    // INITIALIZATION & PRE-INDEXING
    // =========================================================================
    function initApp() {
        loadDataFromStorage();
        bindEvents();
        setupSliderControls();
        setupAntiDownloadSecurity();
        renderAllSliders();
        updateStats();
        updateUpiLinks(selectedChaiAmount);
        updateMasterFolderLinks();
    }

    function indexEpisodeForSearch(ep) {
        const tagsStr = Array.isArray(ep.tags) ? ep.tags.join(' ') : '';
        ep._searchIndex = `${ep.title} ${ep.description} ep ${ep.episodeNum} season ${ep.season} ${tagsStr}`.toLowerCase();
    }

        function getMasterDriveFolder() {
        return localStorage.getItem(STORAGE_KEYS.MASTER_FOLDER) || 
               (typeof DEFAULT_SERIES_INFO !== 'undefined' && DEFAULT_SERIES_INFO.driveFolderUrl) ||
               'https://drive.google.com/drive/folders/1AermIto6wOKAT_rHowr4629uE5g0gYsU';
    }

    function updateMasterFolderLinks() {
        const folderUrl = getMasterDriveFolder();
        if (DOM.navDriveFolderBtn) DOM.navDriveFolderBtn.href = folderUrl;
        if (DOM.heroDriveFolderBtn) DOM.heroDriveFolderBtn.href = folderUrl;
        if (DOM.openMasterDriveBtn) DOM.openMasterDriveBtn.href = folderUrl;
        if (DOM.masterDriveFolderInput) DOM.masterDriveFolderInput.value = folderUrl;
        if (DOM.masterFolderIdBadge) DOM.masterFolderIdBadge.innerText = extractGoogleDriveId(folderUrl) || '1AermIto6wOKAT_rHowr4629uE5g0gYsU';
    }

        function loadDataFromStorage() {
        try {
            // 1. Clone fresh default episodes from data.js
            episodes = JSON.parse(JSON.stringify(DEFAULT_EPISODES));

            // 2. Append any extra custom episodes
            if (typeof EXTRA_EPISODES !== 'undefined' && Array.isArray(EXTRA_EPISODES)) {
                EXTRA_EPISODES.forEach((extra, idx) => {
                    if (extra && (extra.title || extra.link)) {
                        const extraId = extra.id || ('extra-' + (idx + 1));
                        if (!episodes.some(e => e.id === extraId)) {
                            episodes.push({
                                id: extraId,
                                season: extra.season || 1,
                                episodeNum: extra.episodeNum || (episodes.length + 1),
                                title: extra.title || ('Bonus Episode ' + (idx + 1)),
                                description: extra.description || "Special uncut bonus stream.",
                                duration: extra.duration || "45 min",
                                link: extra.link || "",
                                driveId: extra.link || "",
                                thumbnail: extra.thumbnail || "assets/thumbnails/s1_thumb.webp",
                                isPremium: Boolean(extra.isPremium)
                            });
                        }
                    }
                });
            }

            // 3. Automatically check embedded links
            // If a link is embedded (in VIDEO_STREAM_LINKS, ep.link, ep.url, or ep.driveId),
            // it is AUTOMATICALLY marked as ready to stream!
            episodes.forEach(ep => {
                const quickLink = (typeof VIDEO_STREAM_LINKS !== 'undefined' && VIDEO_STREAM_LINKS[ep.id]) || '';
                const rawLink = quickLink || ep.link || ep.url || ep.driveId || '';
                const cleanId = extractGoogleDriveId(rawLink);

                if (cleanId && cleanId !== '1AermIto6wOKAT_rHowr4629uE5g0gYsU' && !cleanId.includes('sample-drive-id')) {
                    ep.driveId = cleanId;
                    ep.link = cleanId;
                    ep.isStreamReady = true;
                } else {
                    ep.driveId = '';
                    ep.link = '';
                    ep.isStreamReady = false;
                }
            });

            saveEpisodesToStorage();
            episodes.forEach(indexEpisodeForSearch);

            const storedWatched = localStorage.getItem(STORAGE_KEYS.WATCHED);
            if (storedWatched) {
                watchedEpisodes = new Set(JSON.parse(storedWatched));
            }
        } catch (e) {
            console.error('Storage error:', e);
            episodes = JSON.parse(JSON.stringify(DEFAULT_EPISODES));
            episodes.forEach(indexEpisodeForSearch);
        }
    }

    function saveEpisodesToStorage() {
        try {
            localStorage.setItem(STORAGE_KEYS.EPISODES, JSON.stringify(episodes));
        } catch (e) {
            console.error('Save error:', e);
        }
    }

    function saveUserDataToStorage() {
        try {
            localStorage.setItem(STORAGE_KEYS.WATCHED, JSON.stringify(Array.from(watchedEpisodes)));
        } catch (e) {
            console.error('Save user data error:', e);
        }
    }

    // =========================================================================
    // UPI PAYMENT APP INTENT GENERATION & REDIRECT
    // =========================================================================
    function getUpiIntentUrl(amount) {
        const upiId = (DOM.upiIdText && DOM.upiIdText.innerText) ? DOM.upiIdText.innerText.trim() : 'siddharthakumar109-2@okhdfcbank';
        const amtParam = amount && amount !== 'custom' ? `&am=${encodeURIComponent(amount)}` : '';
        return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=Siddhartha%20Gautam&mc=&tr=&tn=Support%20IGL%20Developer${amtParam}&cu=INR`;
    }

    function updateUpiLinks(amount) {
        const url = getUpiIntentUrl(amount);
        if (DOM.payViaUpiAppBtn) {
            DOM.payViaUpiAppBtn.href = url;
        }
        if (DOM.payTierAmountDisplay) {
            DOM.payTierAmountDisplay.innerText = amount && amount !== 'custom' ? `₹${amount}` : 'Any';
        }
        if (DOM.upiIntentLinks) {
            DOM.upiIntentLinks.forEach(link => {
                link.href = url;
            });
        }
    }

    function triggerUpiPayment(e) {
        const upiId = (DOM.upiIdText && DOM.upiIdText.innerText) ? DOM.upiIdText.innerText.trim() : 'siddharthakumar109-2@okhdfcbank';
        
        // Auto-copy UPI ID to clipboard as a reliable fallback for desktop
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(upiId).catch(() => {});
        }

        const amtText = selectedChaiAmount && selectedChaiAmount !== 'custom' ? `₹${selectedChaiAmount}` : '';
        showToast(`🚀 Opening UPI Payment App ${amtText ? `for ${amtText}` : ''}... (UPI ID copied)`, 'info');
    }

        // =========================================================================
    // GOOGLE DRIVE LINK PARSER & CLOUD STREAM ENGINE
    // =========================================================================
    function extractGoogleDriveId(input) {
        if (!input) return '';
        input = input.trim();

        // Matches /folders/<id>
        const matchFolder = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
        if (matchFolder && matchFolder[1]) return matchFolder[1];

        // Matches /file/d/<id>
        const matchFileD = input.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (matchFileD && matchFileD[1]) return matchFileD[1];

        // Matches ?id=<id>
        const matchIdParam = input.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

        if (!input.includes('/') && !input.includes('.')) {
            return input;
        }

        return input;
    }

        function isEpisodeStreamReady(ep) {
        if (!ep || !ep.driveId) return false;
        const cleanId = extractGoogleDriveId(ep.driveId);
        if (!cleanId || cleanId === '1AermIto6wOKAT_rHowr4629uE5g0gYsU' || cleanId.includes('sample-drive-id')) return false;
        return true;
    }

    function isDriveFolder(input) {
        if (!input) return false;
        if (typeof input !== 'string') return false;
        if (input.includes('/folders/')) return true;
        const cleanId = extractGoogleDriveId(input);
        if (cleanId === '1AermIto6wOKAT_rHowr4629uE5g0gYsU') return true;
        if (typeof DEFAULT_SERIES_INFO !== 'undefined' && DEFAULT_SERIES_INFO.driveFolderId && cleanId === DEFAULT_SERIES_INFO.driveFolderId) return true;
        return false;
    }

    function getDriveEmbedUrl(driveId) {
        const cleanId = extractGoogleDriveId(driveId);
        if (!cleanId) return '';
        if (isDriveFolder(driveId) || cleanId === '1AermIto6wOKAT_rHowr4629uE5g0gYsU') {
            return `https://drive.google.com/embeddedfolderview?id=${cleanId}#grid`;
        }
        return `https://drive.google.com/file/d/${cleanId}/preview`;
    }

    function getDriveDirectViewUrl(driveId) {
        const cleanId = extractGoogleDriveId(driveId);
        if (!cleanId) return '#';
        if (isDriveFolder(driveId) || cleanId === '1AermIto6wOKAT_rHowr4629uE5g0gYsU') {
            return `https://drive.google.com/drive/folders/${cleanId}`;
        }
        return `https://drive.google.com/file/d/${cleanId}/view?usp=sharing`;
    }

    // =========================================================================
    // HIGH-PERFORMANCE CARD RENDERING & EVENT DELEGATION
    // =========================================================================
    function createEpisodeCard(ep) {
        const isVip = ep.isPremium || ep.season === 'VIP';
        const isWatched = watchedEpisodes.has(ep.id);
        const isPlayable = isEpisodeStreamReady(ep);

        const seasonTag = isVip ? `VIP • SP ${ep.episodeNum < 10 ? '0' + ep.episodeNum : ep.episodeNum}` 
                                : `S${ep.season} • EP ${ep.episodeNum < 10 ? '0' + ep.episodeNum : ep.episodeNum}`;

        const card = document.createElement('div');
        card.className = `episode-card ${isVip ? 'is-vip' : ''} ${isPlayable ? 'is-stream-ready' : ''}`;
        card.dataset.id = ep.id;

        card.innerHTML = `
            <div class="card-thumbnail-wrap" data-action="play" data-id="${ep.id}">
                <img 
                    src="${ep.thumbnail || 'assets/thumbnails/s1_thumb.webp'}" 
                    alt="${ep.title}" 
                    class="card-img" 
                    width="240" 
                    height="135" 
                    loading="lazy" 
                    decoding="async">
                <div class="card-thumbnail-overlay"></div>
                <span class="card-badge-ep">${seasonTag}</span>
                ${isVip ? '<span class="card-badge-vip"><i class="fa-solid fa-crown"></i> VIP</span>' : ''}
                ${isPlayable ? '<span class="card-badge-ready"><i class="fa-solid fa-bolt"></i> STREAM READY (1080p)</span>' : '<span class="card-badge-duration">' + ep.duration + '</span>'}
                <button class="card-play-hover-btn ${isPlayable ? 'btn-hover-live' : ''}" data-action="play" data-id="${ep.id}" title="${isPlayable ? 'Stream Episode Inside Web Player' : 'Episode Info'}">
                    <i class="fa-solid fa-play"></i>
                </button>
                ${isWatched ? '<div class="card-progress-bar"><div class="progress-fill"></div></div>' : ''}
            </div>
            <div class="card-body">
                <div class="card-title-row">
                    <h4 class="card-title" title="${ep.title}">${ep.title}</h4>
                </div>
                <div class="card-meta-line">
                    ${isPlayable 
                        ? `<span class="meta-tag-pill meta-stream-live"><i class="fa-solid fa-circle-play"></i> Available Now</span>` 
                        : `<span class="meta-tag-pill">${isVip ? 'VIP Special' : 'Coming Soon'}</span>`}
                    <span class="meta-dot">•</span>
                    <span class="meta-runtime">${ep.fileSize ? ep.fileSize : ep.duration}</span>
                    ${isWatched ? '<span class="watched-tag"><i class="fa-solid fa-check"></i> Watched</span>' : ''}
                </div>
                <button class="btn-quick-play ${isPlayable ? 'btn-live-stream' : ''}" data-action="play" data-id="${ep.id}">
                    <i class="fa-solid fa-play"></i> ${isPlayable ? 'Watch Video' : 'Episode Info'}
                </button>
            </div>
        `;

        return card;
    }

    function renderAllSliders() {
        // 1. Season 1 Track
        const s1Episodes = episodes.filter(ep => ep.season === 1);
        const s1Frag = document.createDocumentFragment();
        s1Episodes.forEach(ep => s1Frag.appendChild(createEpisodeCard(ep)));
        DOM.season1Track.innerHTML = '';
        DOM.season1Track.appendChild(s1Frag);
        DOM.s1SliderCounter.innerText = `12 Episodes • Uncut`;

        // 2. Season 2 Track
        const s2Episodes = episodes.filter(ep => ep.season === 2);
        const s2Frag = document.createDocumentFragment();
        s2Episodes.forEach(ep => s2Frag.appendChild(createEpisodeCard(ep)));
        DOM.season2Track.innerHTML = '';
        DOM.season2Track.appendChild(s2Frag);
        DOM.s2SliderCounter.innerText = `12 Episodes • 4K HDR`;

        // 3. VIP Vault Track
        const vipEpisodes = episodes.filter(ep => ep.isPremium || ep.season === 'VIP');
        const vipFrag = document.createDocumentFragment();
        vipEpisodes.forEach(ep => vipFrag.appendChild(createEpisodeCard(ep)));
        DOM.vipTrack.innerHTML = '';
        DOM.vipTrack.appendChild(vipFrag);
        DOM.vipSliderCounter.innerText = `6 Free Uncut Specials`;
    }

    // Fast In-Memory Pre-indexed Search
    function renderSearchResults(query) {
        if (!query) {
            DOM.searchSection.classList.add('hidden');
            return;
        }

        const q = query.toLowerCase();
        const matches = episodes.filter(ep => ep._searchIndex && ep._searchIndex.includes(q));

        DOM.searchTrack.innerHTML = '';
        DOM.searchResultQueryText.innerText = query;
        DOM.searchResultCountText.innerText = `Found ${matches.length} matching episode(s)`;

        if (matches.length > 0) {
            const searchFrag = document.createDocumentFragment();
            matches.forEach(ep => searchFrag.appendChild(createEpisodeCard(ep)));
            DOM.searchTrack.appendChild(searchFrag);
        } else {
            DOM.searchTrack.innerHTML = `
                <div style="padding: 2.5rem; color: #94a3b8; font-size: 0.95rem;">
                    <i class="fa-regular fa-folder-open" style="font-size: 1.5rem; margin-right: 0.5rem;"></i>
                    No episodes found matching "${query}". Try another title or keyword.
                </div>
            `;
        }

        const wasHidden = DOM.searchSection.classList.contains('hidden');
        DOM.searchSection.classList.remove('hidden');
        if (wasHidden) {
            DOM.searchSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function updateStats() {
        if (DOM.statsWatched) {
            DOM.statsWatched.innerText = watchedEpisodes.size;
        }
    }

    // =========================================================================
    // SLIDER CONTROLS (Smooth Scrolling & RAF Throttled Dragging)
    // =========================================================================
    function handleTrackClick(e) {
        if (e.target.closest('.slider-btn-prev') || e.target.closest('.slider-btn-next') || e.target.closest('.floating-nav-arrow')) return;
        const card = e.target.closest('.episode-card') || e.target.closest('[data-action="play"]');
        if (card && card.dataset.id) {
            requestPlayEpisode(card.dataset.id);
        }
    }

    function setupSliderControls() {
        document.querySelectorAll('[data-target]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.dataset.target;
                const track = document.getElementById(targetId);
                if (!track) return;

                const scrollAmount = Math.max(340, Math.floor(track.clientWidth * 0.75));
                const isNext = btn.classList.contains('slider-btn-next') || btn.classList.contains('float-arrow-right');
                track.scrollBy({ left: isNext ? scrollAmount : -scrollAmount, behavior: 'smooth' });
            });
        });

        const tracks = [DOM.season1Track, DOM.season2Track, DOM.vipTrack, DOM.searchTrack];
        tracks.forEach(track => {
            if (!track) return;
            
            track.addEventListener('click', handleTrackClick);

            let isDown = false;
            let startX = 0;
            let scrollStart = 0;
            let trackLeft = 0;
            let rafId = null;
            let targetScrollLeft = 0;

            track.addEventListener('mousedown', (e) => {
                if (e.target.closest('button')) return;
                isDown = true;
                track.style.cursor = 'grabbing';
                track.style.scrollSnapType = 'none';
                trackLeft = track.getBoundingClientRect().left;
                startX = e.clientX - trackLeft;
                scrollStart = track.scrollLeft;
                targetScrollLeft = scrollStart;
            });

            const stopDrag = () => {
                if (!isDown) return;
                isDown = false;
                track.style.cursor = '';
                track.style.scrollSnapType = 'x mandatory';
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            };

            track.addEventListener('mouseleave', stopDrag);
            track.addEventListener('mouseup', stopDrag);

            track.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.clientX - trackLeft;
                const walk = (x - startX) * 1.4;
                targetScrollLeft = scrollStart - walk;

                if (!rafId) {
                    rafId = requestAnimationFrame(() => {
                        track.scrollLeft = targetScrollLeft;
                        rafId = null;
                    });
                }
            });
        });
    }

    // =========================================================================
    // DEVELOPER CONTRIBUTION / BUY CHAI QR MODAL (Pre-Roll Video Intercept)
    // =========================================================================
    function requestPlayEpisode(episodeId) {
        openPlayerModal(episodeId);
    }

    function openDonateModal(episodeId = null) {
        pendingEpisodeIdToPlay = episodeId;

        if (episodeId) {
            const ep = episodes.find(e => e.id === episodeId);
            if (ep) {
                const isVip = ep.isPremium || ep.season === 'VIP';
                const tag = isVip ? `VIP SP ${ep.episodeNum}` : `S${ep.season} • EP ${ep.episodeNum}`;
                if (DOM.donateEpisodeTitle) {
                    DOM.donateEpisodeTitle.innerText = `${tag}: ${ep.title}`;
                }
            } else if (DOM.donateEpisodeTitle) {
                DOM.donateEpisodeTitle.innerText = "India's Got Latent Stream";
            }
        } else if (DOM.donateEpisodeTitle) {
            DOM.donateEpisodeTitle.innerText = "India's Got Latent - Support Project";
        }

        if (DOM.donateModal) {
            DOM.donateModal.classList.add('active');
            DOM.donateModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeDonateModal(proceedToPlay = false) {
        if (DOM.donateModal) {
            DOM.donateModal.classList.remove('active');
            DOM.donateModal.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';

        if (proceedToPlay && pendingEpisodeIdToPlay) {
            const targetId = pendingEpisodeIdToPlay;
            pendingEpisodeIdToPlay = null;
            openPlayerModal(targetId);
        } else {
            pendingEpisodeIdToPlay = null;
        }
    }

    // =========================================================================
    // CINEMA VIDEO PLAYER MODAL & GRACEFUL ERROR HANDLING
    // =========================================================================
        function openPlayerModal(episodeId) {
        const episode = episodes.find(e => e.id === episodeId);
        if (!episode) return;

        currentPlayingEpisodeId = episodeId;
        const isVip = episode.isPremium || episode.season === 'VIP';
        const tagText = isVip ? `VIP SP ${episode.episodeNum}` : `S${episode.season} • EP ${episode.episodeNum}`;

        DOM.playerEpisodeTag.innerText = tagText;
        DOM.playerEpisodeTitle.innerText = episode.title;

        if (DOM.videoErrorOverlay) DOM.videoErrorOverlay.classList.add('hidden');

        const isPlayable = isEpisodeStreamReady(episode);

        if (isPlayable) {
            const cleanId = extractGoogleDriveId(episode.driveId);
            const embedUrl = `https://drive.google.com/file/d/${cleanId}/preview`;
            DOM.driveVideoIframe.style.display = 'block';
            DOM.driveVideoIframe.src = embedUrl;

            if (DOM.unloadedNoticeOverlay) DOM.unloadedNoticeOverlay.classList.add('hidden');
            if (DOM.sampleNoticeBanner) DOM.sampleNoticeBanner.classList.add('hidden');
            showToast(`Streaming: ${episode.title}`, 'info');
        } else {
            DOM.driveVideoIframe.src = 'about:blank';
            DOM.driveVideoIframe.style.display = 'none';

            if (DOM.unloadedNoticeOverlay) {
                DOM.unloadedNoticeOverlay.classList.remove('hidden');
                if (DOM.unloadedTitle) DOM.unloadedTitle.innerText = `${tagText}: ${episode.title}`;
            }
            if (DOM.sampleNoticeBanner) DOM.sampleNoticeBanner.classList.add('hidden');
        }

        updatePlayerActionButtons(episode.id);
        renderDrawerEpisodeList(episode.season);

        DOM.playerModal.classList.add('active');
        DOM.playerModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (videoLoadTimeoutTimer) clearTimeout(videoLoadTimeoutTimer);
    }

    function retryCurrentVideo() {
        if (!currentPlayingEpisodeId) return;
        const episode = episodes.find(e => e.id === currentPlayingEpisodeId);
        if (!episode) return;

        if (DOM.videoErrorOverlay) DOM.videoErrorOverlay.classList.add('hidden');
        DOM.driveVideoIframe.src = 'about:blank';
        setTimeout(() => {
            DOM.driveVideoIframe.src = getDriveEmbedUrl(episode.driveId);
            showToast('Retrying video stream...', 'info');
        }, 300);
    }

    function closePlayerModal() {
        if (videoLoadTimeoutTimer) {
            clearTimeout(videoLoadTimeoutTimer);
            videoLoadTimeoutTimer = null;
        }
        DOM.playerModal.classList.remove('active');
        DOM.playerModal.classList.remove('theater-mode');
        DOM.playerModal.setAttribute('aria-hidden', 'true');
        
        DOM.driveVideoIframe.src = 'about:blank';
        if (DOM.videoErrorOverlay) DOM.videoErrorOverlay.classList.add('hidden');

        document.body.style.overflow = '';
        currentPlayingEpisodeId = null;
    }

    function updatePlayerActionButtons(episodeId) {
        const isWatched = watchedEpisodes.has(episodeId);
        if (isWatched) {
            DOM.markWatchedBtn.style.color = 'var(--color-success)';
            DOM.markWatchedText.innerText = 'Watched ✓';
        } else {
            DOM.markWatchedBtn.style.color = '';
            DOM.markWatchedText.innerText = 'Mark as Watched';
        }
    }

    function playAdjacentEpisode(direction) {
        if (!currentPlayingEpisodeId) return;

        const currentIndex = episodes.findIndex(e => e.id === currentPlayingEpisodeId);
        if (currentIndex === -1) return;

        const targetIndex = currentIndex + direction;
        if (targetIndex >= 0 && targetIndex < episodes.length) {
            openPlayerModal(episodes[targetIndex].id);
        } else {
            showToast(direction > 0 ? 'You have reached the final episode.' : 'This is the first episode.', 'info');
        }
    }

    function renderDrawerEpisodeList(currentSeason) {
        DOM.drawerEpisodeList.innerHTML = '';
        const list = episodes.filter(e => e.season === currentSeason);
        const drawerFrag = document.createDocumentFragment();

        list.forEach(ep => {
            const isCurrent = ep.id === currentPlayingEpisodeId;
            const item = document.createElement('div');
            item.className = `drawer-card ${isCurrent ? 'active' : ''}`;
            item.innerHTML = `
                <span class="drawer-card-num">EP ${ep.episodeNum}</span>
                <div class="drawer-card-info">
                    <div class="drawer-card-title">${ep.title}</div>
                    <div class="drawer-card-dur">${ep.duration}</div>
                </div>
            `;
            item.addEventListener('click', () => {
                openPlayerModal(ep.id);
                DOM.playerEpisodeDrawer.classList.add('hidden');
            });
            drawerFrag.appendChild(item);
        });

        DOM.drawerEpisodeList.appendChild(drawerFrag);
    }

    // =========================================================================
    // GRANULAR MICRO-DOM UPDATES (Zero Full-Page Layout Thrashing)
    // =========================================================================
    function toggleWatched(episodeId) {
        const isNowWatched = !watchedEpisodes.has(episodeId);
        if (isNowWatched) {
            watchedEpisodes.add(episodeId);
            showToast('Marked as Watched ✓', 'success');
        } else {
            watchedEpisodes.delete(episodeId);
            showToast('Marked as Unwatched', 'info');
        }
        saveUserDataToStorage();
        updateStats();

        document.querySelectorAll(`.episode-card[data-id="${episodeId}"]`).forEach(card => {
            const thumbWrap = card.querySelector('.card-thumbnail-wrap');
            const metaLine = card.querySelector('.card-meta-line');

            let progressBar = thumbWrap ? thumbWrap.querySelector('.card-progress-bar') : null;
            if (isNowWatched && !progressBar && thumbWrap) {
                const bar = document.createElement('div');
                bar.className = 'card-progress-bar';
                bar.innerHTML = '<div class="progress-fill"></div>';
                thumbWrap.appendChild(bar);
            } else if (!isNowWatched && progressBar) {
                progressBar.remove();
            }

            let watchedTag = metaLine ? metaLine.querySelector('.watched-tag') : null;
            if (isNowWatched && !watchedTag && metaLine) {
                const tag = document.createElement('span');
                tag.className = 'watched-tag';
                tag.innerHTML = '<i class="fa-solid fa-check"></i> Watched';
                metaLine.appendChild(tag);
            } else if (!isNowWatched && watchedTag) {
                watchedTag.remove();
            }
        });

        if (currentPlayingEpisodeId === episodeId) {
            updatePlayerActionButtons(episodeId);
        }
    }

    // =========================================================================
    // ANTI-DOWNLOAD SECURITY SHIELD
    // =========================================================================
    function setupAntiDownloadSecurity() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showToast('🔒 Right-click is disabled for stream protection.', 'info');
            return false;
        });

        document.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'F12') {
                e.preventDefault();
                showToast('🔒 Developer tools are locked.', 'info');
                return false;
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                showToast('🔒 Direct video downloading is restricted.', 'info');
                return false;
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
                e.preventDefault();
                showToast('🔒 View source is locked.', 'info');
                return false;
            }
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) {
                e.preventDefault();
                showToast('🔒 Inspect window is locked.', 'info');
                return false;
            }
            if (e.key === 'Escape') {
                if (DOM.donateModal && DOM.donateModal.classList.contains('active')) closeDonateModal(false);
                if (DOM.playerModal.classList.contains('active')) closePlayerModal();
                if (DOM.adminModal.classList.contains('active')) closeAdminModal();
            }
        });
    }

    // =========================================================================
    // ADMIN / DRIVE LINK MANAGER
    // =========================================================================
    function openAdminModal(seasonTarget = '1') {
        currentAdminSeason = seasonTarget;
        updateMasterFolderLinks();
        updateAdminTabs();
        renderAdminEpisodeList();
        DOM.adminModal.classList.add('active');
        DOM.adminModal.setAttribute('aria-hidden', 'false');
    }

    function closeAdminModal() {
        DOM.adminModal.classList.remove('active');
        DOM.adminModal.setAttribute('aria-hidden', 'true');
    }

    function updateAdminTabs() {
        DOM.adminTabs.forEach(tab => {
            if (tab.dataset.adminSeason === currentAdminSeason) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    function renderAdminEpisodeList() {
        const filterText = DOM.adminFilterInput.value.toLowerCase().trim();
        DOM.adminEpisodesList.innerHTML = '';

        const seasonEps = episodes.filter(ep => {
            const matchesSeason = ep.season.toString() === currentAdminSeason.toString();
            if (!matchesSeason) return false;
            if (!filterText) return true;
            return ep.title.toLowerCase().includes(filterText) || `ep ${ep.episodeNum}`.toLowerCase().includes(filterText);
        });

        const adminFrag = document.createDocumentFragment();
        seasonEps.forEach(ep => {
            const item = document.createElement('div');
            item.className = 'admin-ep-item';
            item.dataset.id = ep.id;

            const isVip = ep.isPremium || ep.season === 'VIP';
            const seasonLabel = isVip ? `VIP Special ${ep.episodeNum}` : `Season ${ep.season} • Episode ${ep.episodeNum}`;

            item.innerHTML = `
                <div class="admin-ep-header">
                    <span class="admin-ep-num">${seasonLabel}</span>
                    <span class="tag-pill">${ep.duration}</span>
                </div>
                <div class="admin-ep-fields">
                    <div class="admin-input-group">
                        <label>Episode Title</label>
                        <input type="text" class="field-title" value="${ep.title}">
                    </div>
                    <div class="admin-input-group">
                        <label>Video Storage File ID or URL</label>
                        <input type="text" class="field-drive-id" placeholder="Storage ID or file URL..." value="${ep.driveId}">
                    </div>
                    <div class="admin-input-group">
                        <label>Duration (e.g. 45 min)</label>
                        <input type="text" class="field-duration" value="${ep.duration}">
                    </div>
                    <div class="admin-input-group">
                        <label>Thumbnail Path / URL</label>
                        <input type="text" class="field-thumb" value="${ep.thumbnail}">
                    </div>
                    <div class="admin-input-group full-width">
                        <label>Episode Synopsis / Description</label>
                        <textarea class="field-desc" rows="2">${ep.description}</textarea>
                    </div>
                </div>
            `;
            adminFrag.appendChild(item);
        });

        DOM.adminEpisodesList.appendChild(adminFrag);
    }

    function saveAdminChanges() {
        const items = DOM.adminEpisodesList.querySelectorAll('.admin-ep-item');
        let updatedCount = 0;

        items.forEach(item => {
            const id = item.dataset.id;
            const targetEp = episodes.find(e => e.id === id);
            if (!targetEp) return;

            const newTitle = item.querySelector('.field-title').value.trim();
            const rawDriveInput = item.querySelector('.field-drive-id').value.trim();
            const newDuration = item.querySelector('.field-duration').value.trim();
            const newThumb = item.querySelector('.field-thumb').value.trim();
            const newDesc = item.querySelector('.field-desc').value.trim();

            const extractedId = extractGoogleDriveId(rawDriveInput);

            if (newTitle) targetEp.title = newTitle;
            targetEp.driveId = extractedId;
            if (newDuration) targetEp.duration = newDuration;
            if (newThumb) targetEp.thumbnail = newThumb;
            if (newDesc) targetEp.description = newDesc;

            indexEpisodeForSearch(targetEp);
            updatedCount++;
        });

        if (DOM.masterDriveFolderInput) {
            const masterFolder = DOM.masterDriveFolderInput.value.trim();
            if (masterFolder) {
                localStorage.setItem(STORAGE_KEYS.MASTER_FOLDER, masterFolder);
                updateMasterFolderLinks();
            }
        }
        saveEpisodesToStorage();
        renderAllSliders();
        closeAdminModal();
        showToast(`${updatedCount} episode links saved successfully! 🎉`, 'success');
    }

    function resetToDefaultData() {
        if (confirm('Are you sure you want to reset all episodes and Google Drive links to default?')) {
            episodes = JSON.parse(JSON.stringify(DEFAULT_EPISODES));
            episodes.forEach(indexEpisodeForSearch);
            saveEpisodesToStorage();
            renderAdminEpisodeList();
            renderAllSliders();
            showToast('Default episode data restored.', 'info');
        }
    }

    function exportBackupJson() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(episodes, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `igl-stream-episodes-backup-${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Backup JSON file exported successfully.', 'success');
    }

    // =========================================================================
    // TOAST NOTIFICATIONS
    // =========================================================================
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconHtml = '<i class="fa-solid fa-circle-info"></i>';
        if (type === 'success') iconHtml = '<i class="fa-solid fa-circle-check"></i>';
        if (type === 'warning') iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';

        toast.innerHTML = `${iconHtml}<span>${message}</span>`;
        DOM.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(15px)';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // =========================================================================
    // EVENT BINDINGS
    // =========================================================================
    function bindEvents() {
        // Hero Play Button
        if (DOM.heroPlayS1Btn) {
            DOM.heroPlayS1Btn.addEventListener('click', () => {
                const s1Ep1 = episodes.find(e => e.season === 1 && e.episodeNum === 1);
                if (s1Ep1) requestPlayEpisode(s1Ep1.id);
            });
        }

        // Developer Contribution QR Modal Controls
        if (DOM.closeDonateBtn) {
            DOM.closeDonateBtn.addEventListener('click', () => {
                closeDonateModal(Boolean(pendingEpisodeIdToPlay));
            });
        }
        if (DOM.donateBackdrop) {
            DOM.donateBackdrop.addEventListener('click', () => {
                closeDonateModal(Boolean(pendingEpisodeIdToPlay));
            });
        }
        if (DOM.donateContinueBtn) {
            DOM.donateContinueBtn.addEventListener('click', () => {
                closeDonateModal(true);
            });
        }
        if (DOM.donateContributedBtn) {
            DOM.donateContributedBtn.addEventListener('click', () => {
                showToast('🎉 Thank you so much for your contribution! Enjoy India\'s Got Latent! 💖', 'success');
                closeDonateModal(true);
            });
        }

        // Copy UPI ID button
        if (DOM.copyUpiBtn) {
            DOM.copyUpiBtn.addEventListener('click', () => {
                const upiText = DOM.upiIdText ? DOM.upiIdText.innerText.trim() : 'siddharthakumar109-2@okhdfcbank';
                navigator.clipboard.writeText(upiText).then(() => {
                    DOM.copyUpiBtn.classList.add('copied');
                    if (DOM.copyBtnText) DOM.copyBtnText.innerText = 'Copied! ✓';
                    showToast(`UPI ID "${upiText}" copied to clipboard!`, 'success');
                    setTimeout(() => {
                        DOM.copyUpiBtn.classList.remove('copied');
                        if (DOM.copyBtnText) DOM.copyBtnText.innerText = 'Copy';
                    }, 2500);
                }).catch(() => {
                    showToast(`UPI ID: ${upiText}`, 'info');
                });
            });
        }

        // Direct Payment Intent App Triggers
        if (DOM.payViaUpiAppBtn) {
            DOM.payViaUpiAppBtn.addEventListener('click', (e) => {
                triggerUpiPayment(e);
            });
        }

        if (DOM.upiIntentLinks) {
            DOM.upiIntentLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    triggerUpiPayment(e);
                });
            });
        }

        // Chai Tier buttons (Updates selected amount and UPI links dynamically)
        if (DOM.chaiTierBtns) {
            DOM.chaiTierBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    DOM.chaiTierBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const amt = btn.dataset.amount;
                    selectedChaiAmount = amt;
                    updateUpiLinks(amt);

                    if (amt === 'custom') {
                        showToast('Any amount is deeply appreciated! Tap payment app or scan QR. 💖', 'info');
                    } else {
                        showToast(`Selected ₹${amt} support. Tap UPI App button or scan QR to complete!`, 'info');
                    }
                });
            });
        }

        if (DOM.navSupportBtn) {
            DOM.navSupportBtn.addEventListener('click', () => {
                openDonateModal(currentPlayingEpisodeId || (episodes[0] && episodes[0].id));
            });
        }
        if (DOM.footerSupportLink) {
            DOM.footerSupportLink.addEventListener('click', (e) => {
                e.preventDefault();
                openDonateModal(currentPlayingEpisodeId || (episodes[0] && episodes[0].id));
            });
        }

        // Live Search Input (Debounced by 120ms)
        DOM.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (searchDebounceTimer) clearTimeout(searchDebounceTimer);

            if (!query) {
                DOM.clearSearchBtn.style.display = 'none';
                DOM.searchSection.classList.add('hidden');
                return;
            }

            DOM.clearSearchBtn.style.display = 'block';
            searchDebounceTimer = setTimeout(() => {
                renderSearchResults(query);
            }, 120);
        });

        DOM.clearSearchBtn.addEventListener('click', () => {
            DOM.searchInput.value = '';
            DOM.clearSearchBtn.style.display = 'none';
            DOM.searchSection.classList.add('hidden');
        });

        DOM.resetSearchBtn.addEventListener('click', () => {
            DOM.searchInput.value = '';
            DOM.clearSearchBtn.style.display = 'none';
            DOM.searchSection.classList.add('hidden');
        });

        // Player Controls
        DOM.closePlayerBtn.addEventListener('click', closePlayerModal);
        DOM.playerBackdrop.addEventListener('click', closePlayerModal);
        DOM.toggleTheaterBtn.addEventListener('click', () => {
            DOM.playerModal.classList.toggle('theater-mode');
        });

        if (DOM.fullscreenPlayerBtn) {
            DOM.fullscreenPlayerBtn.addEventListener('click', () => {
                const target = DOM.videoWrapper || DOM.driveVideoIframe;
                if (!document.fullscreenElement) {
                    if (target.requestFullscreen) target.requestFullscreen().catch(() => {});
                    else if (target.webkitRequestFullscreen) target.webkitRequestFullscreen();
                } else {
                    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
                }
            });
        }
        DOM.prevEpisodeBtn.addEventListener('click', () => playAdjacentEpisode(-1));
        DOM.nextEpisodeBtn.addEventListener('click', () => playAdjacentEpisode(1));
        
        DOM.markWatchedBtn.addEventListener('click', () => {
            if (currentPlayingEpisodeId) toggleWatched(currentPlayingEpisodeId);
        });

        DOM.toggleEpisodeListBtn.addEventListener('click', () => {
            DOM.playerEpisodeDrawer.classList.toggle('hidden');
        });
        DOM.closeDrawerBtn.addEventListener('click', () => {
            DOM.playerEpisodeDrawer.classList.add('hidden');
        });

        if (DOM.retryVideoBtn) {
            DOM.retryVideoBtn.addEventListener('click', retryCurrentVideo);
        }

        // In-Player Unloaded Notice Quick Actions
        document.addEventListener('click', (e) => {
            const streamBtn = e.target.closest('.btn-quick-stream');
            if (streamBtn) {
                const epId = streamBtn.dataset.streamId;
                if (epId) openPlayerModal(epId);
            }
        });

        if (DOM.unloadedBackBtn) {
            DOM.unloadedBackBtn.addEventListener('click', closePlayerModal);
        }

        // Master Storage Vault Controls
        if (DOM.applyFolderToAllBtn) {
            DOM.applyFolderToAllBtn.addEventListener('click', () => {
                const folderInput = DOM.masterDriveFolderInput ? DOM.masterDriveFolderInput.value.trim() : '';
                const targetId = extractGoogleDriveId(folderInput) || '1AermIto6wOKAT_rHowr4629uE5g0gYsU';
                episodes.forEach(ep => {
                    ep.driveId = targetId;
                });
                saveEpisodesToStorage();
                renderAdminEpisodeList();
                renderAllSliders();
                showToast(`All ${episodes.length} episodes connected to video storage vault! 🎉`, 'success');
            });
        }

        if (DOM.masterDriveFolderInput) {
            DOM.masterDriveFolderInput.addEventListener('input', (e) => {
                const val = e.target.value.trim();
                if (DOM.masterFolderIdBadge) DOM.masterFolderIdBadge.innerText = extractGoogleDriveId(val) || '1AermIto6wOKAT_rHowr4629uE5g0gYsU';
            });
        }

        // Admin Modal Controls
        if (DOM.adminModalBtn) DOM.adminModalBtn.addEventListener('click', () => openAdminModal('1'));
        if (DOM.closeAdminBtn) DOM.closeAdminBtn.addEventListener('click', closeAdminModal);
        if (DOM.cancelAdminBtn) DOM.cancelAdminBtn.addEventListener('click', closeAdminModal);
        if (DOM.adminBackdrop) DOM.adminBackdrop.addEventListener('click', closeAdminModal);
        if (DOM.saveAllLinksBtn) DOM.saveAllLinksBtn.addEventListener('click', saveAdminChanges);
        if (DOM.resetDataBtn) DOM.resetDataBtn.addEventListener('click', resetToDefaultData);
        if (DOM.exportDataBtn) DOM.exportDataBtn.addEventListener('click', exportBackupJson);

        if (DOM.adminTabs) {
            DOM.adminTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    currentAdminSeason = tab.dataset.adminSeason;
                    updateAdminTabs();
                    renderAdminEpisodeList();
                });
            });
        }

        if (DOM.adminFilterInput) {
            DOM.adminFilterInput.addEventListener('input', () => {
                renderAdminEpisodeList();
            });
        }

        // Footer Actions
        if (DOM.footerAdminLink) {
            DOM.footerAdminLink.addEventListener('click', (e) => {
                e.preventDefault();
                openAdminModal('1');
            });
        }
        if (DOM.footerResetLink) {
            DOM.footerResetLink.addEventListener('click', (e) => {
                e.preventDefault();
                resetToDefaultData();
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();
