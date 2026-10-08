import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import StudioBar from './components/StudioBar.jsx';
import SearchResults from './components/SearchResults.jsx';
import EpisodeSlider from './components/EpisodeSlider.jsx';
import Footer from './components/Footer.jsx';
import SupportDevModal from './components/SupportDevModal.jsx';
import VideoPlayerModal from './components/VideoPlayerModal.jsx';
import ToastContainer from './components/ToastContainer.jsx';

import {
  DEFAULT_EPISODES,
  DEFAULT_SERIES_INFO,
  VIDEO_STREAM_LINKS,
  extractGoogleDriveId
} from './data/seriesData.js';

const STORAGE_KEYS = {
  WATCHED: 'igl_stream_watched_v1',
  AUTONEXT: 'igl_stream_autonext_v1'
};

export default function App() {
  // 1. Episodes with embedded stream links
  const [episodes] = useState(() => {
    return DEFAULT_EPISODES.map((ep) => {
      const quickLink = VIDEO_STREAM_LINKS[ep.id] || '';
      const rawLink = quickLink || ep.link || ep.url || ep.driveId || '';
      const cleanId = extractGoogleDriveId(rawLink);

      const isReady = Boolean(
        cleanId && 
        cleanId !== '1AermIto6wOKAT_rHowr4629uE5g0gYsU' && 
        !cleanId.includes('sample-drive-id')
      );

      return {
        ...ep,
        driveId: isReady ? cleanId : '',
        link: isReady ? cleanId : '',
        isStreamReady: isReady
      };
    });
  });

  // 2. Watched episodes Set
  const [watchedEpisodes, setWatchedEpisodes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATCHED);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // 3. Search query
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Autoplay next state
  const [autoNext, setAutoNext] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTONEXT);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // 5. Modals State
  // Support Dev Modal (intercepts video playback to show QR code and UPI apps!)
  const [supportModal, setSupportModal] = useState({
    isOpen: false,
    targetEpisode: null
  });

  // Cinema Video Player Modal
  const [playerModal, setPlayerModal] = useState({
    isOpen: false,
    episode: null
  });

  // 6. Body Scroll Lock when modals are open (restores on close/unmount)
  useEffect(() => {
    const isAnyModalOpen = supportModal.isOpen || playerModal.isOpen;
    if (isAnyModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [supportModal.isOpen, playerModal.isOpen]);

  // 7. Toast Notifications
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // Save Watched episodes to localStorage
  const handleToggleWatched = (episodeId) => {
    setWatchedEpisodes((prev) => {
      const next = new Set(prev);
      if (next.has(episodeId)) {
        next.delete(episodeId);
        showToast('Removed from Watched', 'info');
      } else {
        next.add(episodeId);
        showToast('Marked as Watched', 'success');
      }
      try {
        localStorage.setItem(STORAGE_KEYS.WATCHED, JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Reset Watched Cache
  const handleResetCache = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.WATCHED);
      setWatchedEpisodes(new Set());
      showToast('Episode watch progress has been reset.', 'success');
    } catch (e) {
      console.error(e);
    }
  };

  // Save AutoNext
  const handleSetAutoNext = (val) => {
    setAutoNext(val);
    try {
      localStorage.setItem(STORAGE_KEYS.AUTONEXT, JSON.stringify(val));
    } catch (e) {
      console.error(e);
    }
  };

  // Intercept video click -> Show Support Dev modal FIRST!
  const handleRequestPlayEpisode = (episode) => {
    setSupportModal({
      isOpen: true,
      targetEpisode: episode
    });
  };

  // Support Dev Modal: Proceed to watch video
  const handleProceedToVideo = () => {
    const target = supportModal.targetEpisode || episodes[0];
    setSupportModal({ isOpen: false, targetEpisode: null });
    setPlayerModal({ isOpen: true, episode: target });
  };

  // Support Dev Modal: I Have Contributed!
  const handleContributed = () => {
    showToast('💖 Thank you so much for supporting the stream! Enjoy the show!', 'success');
    handleProceedToVideo();
  };

  // Close Support Dev Modal
  const handleCloseSupport = () => {
    setSupportModal({ isOpen: false, targetEpisode: null });
  };

  // Open Support Dev Modal from navbar or footer
  const handleOpenSupportDirect = () => {
    setSupportModal({
      isOpen: true,
      targetEpisode: episodes[0] || null
    });
  };

  // Video Player: Close
  const handleClosePlayer = () => {
    setPlayerModal({ isOpen: false, episode: null });
  };

  // Video Player: Switch Episode
  const handleSelectEpisodeInPlayer = (episode) => {
    setPlayerModal({ isOpen: true, episode });
  };

  // Filter episodes by season
  const s1Episodes = useMemo(() => episodes.filter((e) => e.season === 1), [episodes]);
  const s2Episodes = useMemo(() => episodes.filter((e) => e.season === 2), [episodes]);
  const vipEpisodes = useMemo(() => episodes.filter((e) => e.isPremium || e.season === 'VIP'), [episodes]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return episodes.filter((ep) => {
      const titleMatch = ep.title.toLowerCase().includes(q);
      const descMatch = ep.description.toLowerCase().includes(q);
      const tagMatch = Array.isArray(ep.tags) && ep.tags.some((t) => t.toLowerCase().includes(q));
      const epMatch = `ep ${ep.episodeNum}`.includes(q) || `s${ep.season}`.includes(q);
      return titleMatch || descMatch || tagMatch || epMatch;
    });
  }, [episodes, searchQuery]);

  return (
    <div className="app-container">
      {/* Ambient Glows */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="ambient-glow glow-3"></div>

      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSupport={handleOpenSupportDirect}
        watchedCount={watchedEpisodes.size}
        masterDriveUrl={DEFAULT_SERIES_INFO.driveFolderUrl}
      />

      {/* Main Content */}
      <main className="main-wrapper">
        {/* Hero Banner */}
        <Hero
          onWatchPilot={() => handleRequestPlayEpisode(s1Episodes[0])}
          watchedCount={watchedEpisodes.size}
          seriesInfo={DEFAULT_SERIES_INFO}
        />

        {/* Studio Status Bar */}
        <StudioBar />

        {/* Search Results (dynamic) */}
        {searchQuery.trim() && (
          <SearchResults
            searchQuery={searchQuery}
            results={searchResults}
            onClearSearch={() => setSearchQuery('')}
            watchedEpisodes={watchedEpisodes}
            onSelectEpisode={handleRequestPlayEpisode}
          />
        )}

        {/* Row 1: Season 1 Slider */}
        <EpisodeSlider
          sectionId="season1Section"
          trackId="season1Track"
          title="Season 1: The OG Panel & Auditions"
          subtitle="Tanmay Bhat, Kunal Kamra, Raghu Ram, Seedhe Maut & iconic pilot moments"
          icon="fa-microphone-lines"
          glowClass="season1-glow"
          badge="12 Full Episodes • Uncut"
          liveBadge="EPISODES 1-3 STREAM READY (1080P)"
          counterText="12 Episodes • Uncut"
          episodes={s1Episodes}
          watchedEpisodes={watchedEpisodes}
          onSelectEpisode={handleRequestPlayEpisode}
        />

        {/* Row 2: Season 2 Slider */}
        <EpisodeSlider
          sectionId="season2Section"
          trackId="season2Track"
          title="Season 2: Unhinged Chaos & New Latents"
          subtitle="Higher stakes, merciless red buzzers, and the legendary 10/10 scoring syncs"
          icon="fa-fire"
          glowClass="season2-glow"
          badge="12 Blockbuster Episodes • 4K HDR"
          counterText="12 Episodes • 4K HDR"
          episodes={s2Episodes}
          watchedEpisodes={watchedEpisodes}
          onSelectEpisode={handleRequestPlayEpisode}
        />

        {/* Row 3: VIP Vault Slider */}
        <EpisodeSlider
          sectionId="vipSection"
          trackId="vipTrack"
          title="VIP Latent Vault: Uncut & Backstage Specials"
          subtitle="Green room roasts, bizarre rejected audition tapes, red buzzer compilations & Raghu Ram deliberations — completely free with zero subscription charges!"
          icon="fa-crown"
          glowClass="vip-glow"
          counterText="6 Free Specials"
          isVip={true}
          episodes={vipEpisodes}
          watchedEpisodes={watchedEpisodes}
          onSelectEpisode={handleRequestPlayEpisode}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenSupport={handleOpenSupportDirect}
        onResetCache={handleResetCache}
      />

      {/* Developer Contribution / Buy Chai QR Modal (Shown before playing any video) */}
      <SupportDevModal
        isOpen={supportModal.isOpen}
        targetEpisode={supportModal.targetEpisode}
        onClose={handleCloseSupport}
        onProceedToVideo={handleProceedToVideo}
        onContributed={handleContributed}
        showToast={showToast}
      />

      {/* Cinema Video Player Modal */}
      <VideoPlayerModal
        isOpen={playerModal.isOpen}
        episode={playerModal.episode}
        allEpisodes={episodes}
        onClose={handleClosePlayer}
        onSelectEpisode={handleSelectEpisodeInPlayer}
        isWatched={playerModal.episode ? watchedEpisodes.has(playerModal.episode.id) : false}
        onToggleWatched={handleToggleWatched}
        autoNext={autoNext}
        setAutoNext={handleSetAutoNext}
        showToast={showToast}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
