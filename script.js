const headlineInput = document.getElementById("headlineInput");
const tickerInput = document.getElementById("tickerInput");
const headlinePreview = document.getElementById("headlinePreview");
const tickerPreview = document.getElementById("tickerPreview");
const tickerContainer = document.getElementById("tickerContainer");
const newsTemplate = document.getElementById("newsTemplate");
const contentPreview = document.getElementById("contentPreview");
const headlineColor = document.getElementById("headlineColor");
const headlineSize = document.getElementById("headlineSize");
const headlineSizeValue = document.getElementById("headlineSizeValue");
const enableTicker = document.getElementById("enableTicker");
const tickerSpeed = document.getElementById("tickerSpeed");
const backgroundUpload = document.getElementById("backgroundUpload");
const backgroundFileName = document.getElementById("backgroundFileName");
const contentUpload = document.getElementById("contentUpload");
const contentFileName = document.getElementById("contentFileName");
const previewBtn = document.getElementById("previewBtn");
const downloadBtn = document.getElementById("downloadBtn");
const newsCanvas = document.getElementById("newsCanvas");
const currentDate = document.getElementById("currentDate");
const currentTime = document.getElementById("currentTime");
const currentYear = document.getElementById("currentYear");
const displayTime = document.getElementById("displayTime");

// Image URLs
let backgroundImageUrl =
  "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
let contentImageUrl = null;

// Template background images
const templateImages = document.querySelectorAll("[data-bg]");
const contentImages = document.querySelectorAll("[data-content]");

// Initialize
const init = () => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
  currentYear.textContent = new Date().getFullYear();

  // Set initial headline and ticker
  updateHeadline();
  updateTicker();

  // Event listeners
  headlineInput.addEventListener("input", updateHeadline);
  tickerInput.addEventListener("input", updateTicker);
  headlineColor.addEventListener("input", updateHeadline);
  headlineSize.addEventListener("input", updateHeadlineSize);
  enableTicker.addEventListener("change", toggleTicker);
  tickerSpeed.addEventListener("input", updateTickerSpeed);
  backgroundUpload.addEventListener("change", handleBackgroundUpload);

  contentUpload.addEventListener("change", handleContentUpload);
  previewBtn.addEventListener("click", generatePreview);
  downloadBtn.addEventListener("click", downloadImage);

  // Template image selection
  templateImages.forEach((img) => {
    img.addEventListener("click", function () {
      // Remove active class from all
      templateImages.forEach((i) =>
        i.classList.remove("border-blue-500", "border-2")
      );
      // Add active class to clicked
      this.classList.add("border-blue-500", "border-2");

      // Update background
      backgroundImageUrl = this.getAttribute("data-bg");
      newsTemplate.style.backgroundImage = `url('${backgroundImageUrl}')`;
    });
  });

  // Content image selection
  contentImages.forEach((img) => {
    img.addEventListener("click", function () {
      // Remove active class from all
      contentImages.forEach((i) =>
        i.classList.remove("border-blue-500", "border-2")
      );
      // Add active class to clicked
      this.classList.add("border-blue-500", "border-2");

      // Update content image
      contentImageUrl = this.getAttribute("data-content");
      updateContentPreview(contentImageUrl);
    });
  });

  // Set first template as active
  if (templateImages[0])
    templateImages[0].classList.add("border-blue-500", "border-2");
  if (contentImages[0])
    contentImages[0].classList.add("border-blue-500", "border-2");

  // Set initial content images
  if (contentImages[0]) {
    contentImageUrl = contentImages[0].getAttribute("data-content");
    updateContentPreview(contentImageUrl);
  }

  // Size buttons
  document.querySelectorAll("[data-size]").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll("[data-size]")
        .forEach((b) =>
          b.classList.remove("active", "bg-blue-500", "text-white")
        );
      this.classList.add("active", "bg-blue-500", "text-white");

      const ratio = this.getAttribute("data-size");
      updateAspectRatio(ratio);
    });
  });

  // Set 16:9 as active
  const defaultSizeBtn = document.querySelector('[data-size="16/9"]');
  if (defaultSizeBtn)
    defaultSizeBtn.classList.add("active", "bg-blue-500", "text-white");
};

const getResponsiveHeadlineSize = (baseSize) => {
    const vw = window.innerWidth;
    if (vw <= 400) return Math.min(baseSize, 22);
    if (vw <= 640) return Math.min(baseSize, 28);
    if (vw <= 768) return Math.min(baseSize, 32);
    return baseSize;
}

// Update date and time
const updateDateTime = () => {
  const now = new Date();
  currentDate.textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Update content preview
const updateContentPreview = (url) => {
  if (url) {
    contentPreview.style.backgroundImage = `url('${url}')`;
    contentPreview.style.backgroundSize = "cover";
    contentPreview.style.backgroundPosition = "center";
    contentPreview.textContent = "";
  } else {
    contentPreview.style.backgroundImage = "none";
    contentPreview.textContent = "Content Image";
  }
};

// Update headline preview
const updateHeadline = () => {
  const text = (headlineInput.value || "SOMETHING WENT VIRAL ONLINE").toUpperCase();
  const color = headlineColor.value;
  const size = `${headlineSize.value}px`;

  headlinePreview.textContent = text;
  headlinePreview.style.color = color;
  headlinePreview.style.fontSize = size;
};

// Update headline size
const updateHeadlineSize = () => {
  headlineSizeValue.textContent = `${headlineSize.value}px`;
  updateHeadline();
};

// Update ticker preview
const updateTicker = () => {
  const date = new Date();
  const text = tickerInput.value
    ? `• BREAKING: ${tickerInput.value} •`
    : "• BREAKING: This is a sample ticker text that scrolls across the screen •";
  displayTime.textContent = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  tickerPreview.textContent = text.toUpperCase();
};

// Toggle ticker visibility
const toggleTicker = () => {
  if (enableTicker.checked) {
    tickerContainer.classList.remove("hidden");
    tickerContainer.classList.remove("ticker-paused");
  } else {
    tickerContainer.classList.add("hidden");
    tickerContainer.classList.add("ticker-paused");
  }
};

// Update ticker speed
const updateTickerSpeed = () => {
  const speed = tickerSpeed.value;
  const tickerTextElem = document.querySelector(".ticker-text");
  if (tickerTextElem) {
    tickerTextElem.style.animationDuration = `${speed}s`;
  }
};

// Handle background upload
const handleBackgroundUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    backgroundFileName.textContent = file.name;
    const reader = new FileReader();
    reader.onload = function (event) {
      backgroundImageUrl = event.target.result;
      newsTemplate.style.backgroundImage = `url('${backgroundImageUrl}')`;

      // Remove active class from template images
      templateImages.forEach((img) =>
        img.classList.remove("border-blue-500", "border-2")
      );
    };
    reader.readAsDataURL(file);
  }
};

// Handle content upload
const handleContentUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    contentFileName.textContent = file.name;
    const reader = new FileReader();
    reader.onload = function (event) {
      contentImageUrl = event.target.result;
      updateContentPreview(contentImageUrl);

      // Remove active class from content images
      contentImages.forEach((img) =>
        img.classList.remove("border-blue-500", "border-2")
      );
    };
    reader.readAsDataURL(file);
  }
};

// Update aspect ratio
const updateAspectRatio = (ratio) => {
  const container = document.getElementById("previewContainer");
  const template = document.getElementById("newsTemplate");

  if (ratio === "16/9") {
    template.classList.remove("aspect-square", "aspect-4/3");
    template.classList.add("aspect-video");
  } else if (ratio === "1/1") {
    template.classList.remove("aspect-video", "aspect-4/3");
    template.classList.add("aspect-square");
  } else if (ratio === "4/3") {
    template.classList.remove("aspect-video", "aspect-square");
    template.classList.add("aspect-4/3");
  }
};

// Generate preview (same as download but shows in UI)
const generatePreview = () => {
  // For preview, we just use the existing template
  // The download function will handle canvas generation
  alert("Preview is already visible. Click 'Download' to save your image.");
};

// Download image
const downloadImage = () => {
  const container = document.getElementById("previewContainer");
  const template = document.getElementById("newsTemplate");

  // Set canvas dimensions
  const width = 1200;
  let height;

  if (template.classList.contains("aspect-video")) {
    height = Math.round((width * 9) / 16);
  } else if (template.classList.contains("aspect-square")) {
    height = width;
  } else {
    height = Math.round((width * 3) / 4);
  }

  newsCanvas.width = width;
  newsCanvas.height = height;
  const ctx = newsCanvas.getContext("2d");

  // Create images for drawing
  const bgImg = new Image();
  const contentImg = new Image();

  bgImg.crossOrigin = "anonymous";
  contentImg.crossOrigin = "anonymous";

  // Counter to track loaded images
  let imagesLoaded = 0;
  const totalImages = 2;

  const tryDraw = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
      drawFinalImage();
    }
  };

  bgImg.onload = tryDraw;
  contentImg.onload = tryDraw;

  bgImg.src = backgroundImageUrl;
  contentImg.src = contentImageUrl || "";

  const drawFinalImage = () => {
    // Draw background
    ctx.drawImage(bgImg, 0, 0, width, height);

    // Draw gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(0,0,0,0.3)");
    gradient.addColorStop(1, "rgba(0,0,0,0.7)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw content image
    if (contentImageUrl) {
      const contentX = width * 0.7;
      const contentY = height * 0.17;
      const contentWidth = width * 0.22;
      const contentHeight = height * 0.4;

      // Draw border
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.strokeRect(contentX, contentY, contentWidth, contentHeight);

      // Draw image
      ctx.drawImage(
        contentImg,
        contentX,
        contentY,
        contentWidth,
        contentHeight
      );
    }

    // Add Title
    ctx.fillStyle = "#f00";
    ctx.fillRect(10, height - 170, width * 0.2, 140);
    ctx.fillStyle = "#fff";
    ctx.font = `bold 32px Oswald, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("BREAKING NEWS", 20, height - 145);

    // Draw headline
    const headlineText = (
      headlineInput.value || "SOMETHING WENT VIRAL ONLINE"
    ).toUpperCase();

    const headlineColorValue = headlineColor.value;
    const headlineSizeValue = parseInt(headlineSize.value) * (width / 600);

    // Headline Background
    ctx.fillStyle = "#d8d0d0ff";
    ctx.fillRect(10, height - 120, width, 120);
    ctx.fillStyle = headlineColorValue;
    ctx.font = `bold ${headlineSizeValue - 6}px Oswald, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    // Word wrap for headline
    const maxWidth = width * 0.8;
    const lines = wrapText(ctx, headlineText, maxWidth);

    const lineHeight = headlineSizeValue * 1.2;
    const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, 30, height - 90);
    });

    // Draw news channel logo
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(width * 0.05, height * 0.05, 80, 40);
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Oswald, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("LIVE", width * 0.05 + 40, height * 0.05 + 20);

    // Draw date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    ctx.fillStyle = "white";
    ctx.font = "16px Roboto, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(dateStr, width * 0.95, height * 0.07);
    ctx.fillText(timeStr, width * 0.95, height * 0.07 + 25);

    // Draw ticker if enabled
    if (enableTicker.checked) {
      const date = new Date();
      const tickerText = (
        tickerInput.value
          ? `• BREAKING: ${tickerInput.value} •`
          : "• BREAKING: This is a sample ticker text that scrolls across the screen •"
      ).toUpperCase();
      const dates = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Time Background and feature
      ctx.fillStyle = "#000";
      ctx.fillRect(10, height - 50, 118, 50);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px Oswald, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(dates, 20, height - 25);

      // Ticker background
      ctx.fillStyle = "yellow";
      ctx.fillRect(118, height - 50, 1082, 50);

      // Ticker text
      ctx.fillStyle = "#000";
      ctx.font = "bold 20px Oswald, sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(tickerText, 108 + 20, height - 25);
    }

    // Create download link
    const link = document.createElement("a");
    link.download = "breaking-news.png";
    link.href = newsCanvas.toDataURL("image/png");
    link.click();
  };
};

// Helper function to wrap text
const wrapText = (context, text, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0] || "";

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = context.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

// Initialize the app
window.addEventListener("DOMContentLoaded", init);
