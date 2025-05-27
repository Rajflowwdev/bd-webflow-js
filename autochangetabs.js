<script>
document.addEventListener("DOMContentLoaded", function () {
  const tabComponent = document.querySelector(".home-sol-tab");
  const tabLinks = Array.from(document.querySelectorAll(".sol-tab-link"));
  const tabPanes = Array.from(document.querySelectorAll(".sol-tab_pane"));

  let currentIndex = 0;
  let autoRotateInterval = null;
  let observerActive = false;
  let observer;

  // Function to play video
  function playVideoInTab(index) {
    pauseAllVideos();
    const pane = tabPanes[index];
    const link = tabLinks[index];
    const paneVideo = pane.querySelector("video");
    const linkVideo = link.querySelector("video");

    if (paneVideo) {
      paneVideo.currentTime = 0;
      paneVideo.play();
    }
    if (linkVideo) {
      linkVideo.currentTime = 0;
      linkVideo.play();
    }
  }

  // Function to animate progress bar
  function animateProgressBar(index) {
    const progressBar = tabLinks[index].querySelector(".progressbar-load");
    if (progressBar) {
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";
      setTimeout(() => {
        progressBar.style.transition = "width 10s linear";
        progressBar.style.width = "100%";
      }, 20);
    }
  }

  // Activate a specific tab
  function activateTab(index) {
    tabLinks.forEach((link, i) => {
      link.classList.toggle("w--current", i === index);
    });
    tabPanes.forEach((pane, i) => {
      pane.classList.toggle("w--tab-active", i === index);
    });

    playVideoInTab(index);
    animateProgressBar(index);
    currentIndex = index;
  }

  // Pause all videos and progress bars
  function pauseAllVideos() {
    document.querySelectorAll("video").forEach((video) => {
      video.pause();
    });
    document.querySelectorAll(".progressbar-load").forEach((bar) => {
      bar.style.transition = "none";
      bar.style.width = "0%";
    });
  }

  // Auto rotate tabs
  function startAutoRotate() {
    if (autoRotateInterval) clearInterval(autoRotateInterval);
    autoRotateInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % tabLinks.length;
      activateTab(currentIndex);
    }, 10000); // 10s
  }

  // Stop auto rotate
  function stopAutoRotate() {
    clearInterval(autoRotateInterval);
  }

  // Handle manual clicks
  tabLinks.forEach((link, index) => {
    link.addEventListener("click", () => {
      stopAutoRotate();
      activateTab(index);
      startAutoRotate();
    });
  });

  // Intersection Observer to start/stop when in view
  function initObserver() {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (!observerActive) {
              activateTab(currentIndex);
              startAutoRotate();
              observerActive = true;
            }
          } else {
            pauseAllVideos();
            stopAutoRotate();
            observerActive = false;
          }
        });
      },
      { threshold: [0.5] }
    );
    observer.observe(tabComponent);
  }

  initObserver();
});
</script>
