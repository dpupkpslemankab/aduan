const TOPICS = [
  { name: "Permohonan Informasi Data", code: "SEKRE", type: "Permohonan" },
  { name: "Permohonan Magang", code: "SEKRE", type: "Permohonan" },
  { name: "Perizinan PBG dan SLF", code: "P3B", type: "Aduan" },
  { name: "Jalan/Jembatan", code: "BM", type: "Aduan" },
  { name: "Drainase", code: "CK", type: "Aduan" },
  { name: "Irigasi", code: "SDA", type: "Aduan" },
  { name: "Air Minum/SPAM", code: "CK", type: "Aduan" },
  { name: "Perumahan/Rusunawa", code: "PR", type: "Aduan" },
  { name: "Yang lain", code: "LAIN", type: "Aduan" }
];

let selectedTopic = null;

const pages = [...document.querySelectorAll(".page")];
const navItems = [...document.querySelectorAll("[data-page]")];

function goTo(page) {
  pages.forEach(p => p.classList.toggle("active", p.id === `page-${page}`));
  navItems.forEach(n => n.classList.toggle("active", n.dataset.page === page));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

navItems.forEach(item => {
  item.addEventListener("click", () => goTo(item.dataset.page));
});

function renderTopics() {
  const grid = document.getElementById("topic-grid");
  grid.innerHTML = TOPICS.map((topic, index) => `
    <div class="topic-option">
      <input id="topic-${index}" type="radio" name="topic" value="${topic.name}" data-index="${index}">
      <label for="topic-${index}">${topic.name}</label>
    </div>
  `).join("");

  grid.querySelectorAll("input").forEach(input => {
    input.addEventListener("change", () => {
      selectedTopic = TOPICS[Number(input.dataset.index)];
    });
  });
}

function field(name, label, type = "text", required = true, placeholder = "") {
  const requiredMark = required ? " <span>*</span>" : "";
  if (type === "textarea") {
    return `
      <div class="field">
        <label>${label}${requiredMark}</label>
        <textarea class="textarea" name="${name}" ${required ? "required" : ""} placeholder="${placeholder}"></textarea>
      </div>`;
  }

  if (type === "date") {
    return `
      <div class="field">
        <label>${label}${requiredMark}</label>
        <input class="input" name="${name}" type="date" ${required ? "required" : ""}>
      </div>`;
  }

  if (type === "email") {
    return `
      <div class="field">
        <label>${label}${requiredMark}</label>
        <input class="input" name="${name}" type="email" ${required ? "required" : ""} placeholder="${placeholder}">
      </div>`;
  }

  return `
    <div class="field">
      <label>${label}${requiredMark}</label>
      <input class="input" name="${name}" type="${type}" ${required ? "required" : ""} placeholder="${placeholder}">
    </div>`;
}

function section(title, content) {
  return `<div class="form-section"><h3>${title}</h3>${content}</div>`;
}

function renderForm(topic) {
  const container = document.getElementById("dynamic-fields");
  document.getElementById("form-title").textContent = topic.name;
  document.getElementById("form-eyebrow").textContent = topic.type.toUpperCase();

  let html = "";

  if (topic.name === "Permohonan Informasi Data") {
    html =
      section("Identitas Pemohon",
        field("nama", "Nama Pemohon") +
        field("whatsapp", "No WhatsApp / Telepon") +
        field("email", "Email", "email", false) +
        field("alamat", "Alamat / Instansi")
      ) +
      section("Permohonan Informasi",
        field("jenisInformasi", "Jenis informasi/data yang dimohon", "textarea") +
        field("tujuan", "Tujuan penggunaan data/informasi", "textarea")
      ) +
      section("Dokumen",
        field("identitas", "Upload Identitas Diri (KTP, SIM, KTM, dsb.)", "file", true)
      ) +
      section("Pernyataan",
        `<div class="field"><label><input type="checkbox" name="pernyataan" required> Saya menyatakan bahwa data yang saya sampaikan benar dan dapat dipertanggungjawabkan.</label></div>`
      );
  } else if (topic.name === "Permohonan Magang") {
    html =
      section("Data Pemohon",
        field("nama", "Nama Lengkap") +
        field("nisnim", "NIS / NIM") +
        field("ttl", "Tempat, Tanggal Lahir") +
        field("instansi", "Asal Sekolah / Perguruan Tinggi") +
        field("prodi", "Program Studi / Jurusan") +
        field("alamat", "Alamat") +
        field("whatsapp", "Nomor WhatsApp / Telepon") +
        field("email", "Email", "email")
      ) +
      section("Rencana Kegiatan",
        field("jenisKegiatan", "Jenis Kegiatan", "textarea") +
        field("periode", "Periode Magang")
      ) +
      section("Dokumen Pendukung",
        field("dokumenPendukung", "Upload Dokumen Pendukung", "file", false)
      ) +
      section("Pernyataan",
        `<div class="field"><label><input type="checkbox" name="pernyataan" required> Saya menyatakan bahwa data yang saya sampaikan benar dan dapat dipertanggungjawabkan.</label></div>`
      );
  } else {
    html =
      section("Identitas Pelapor",
        field("nama", "Nama Pelapor") +
        field("whatsapp", "Nomor WhatsApp / Telepon") +
        field("email", "Email", "email", false) +
        field("alamat", "Alamat / Desa / Kapanewon")
      ) +
      section("Informasi Aduan",
        field("lokasi", "Lokasi Permasalahan", "textarea") +
        field("deskripsi", "Apa yang ingin Anda laporkan?", "textarea") +
        field("tanggalKejadian", "Kapan permasalahan tersebut terjadi/ditemukan?", "date")
      ) +
      section("Klarifikasi & Bukti",
        `<div class="field">
          <label>Apakah Anda bersedia dihubungi untuk klarifikasi lebih lanjut? <span>*</span></label>
          <div class="radio-group">
            <label><input type="radio" name="bersediaDihubungi" value="Ya" required> Ya</label>
            <label><input type="radio" name="bersediaDihubungi" value="Tidak" required> Tidak</label>
          </div>
        </div>` +
        field("bukti", "Upload Foto / Video Pendukung", "file", false)
      ) +
      section("Pernyataan",
        `<div class="field"><label><input type="checkbox" name="pernyataan" required> Saya menyatakan bahwa informasi yang saya sampaikan benar dan dapat dipertanggungjawabkan.</label></div>`
      );
  }

  container.innerHTML = html;
  document.getElementById("form-description").textContent =
    "Silakan lengkapi data berikut. Pertanyaan disesuaikan dengan topik yang Anda pilih.";
}

document.getElementById("continue-report").addEventListener("click", () => {
  if (!selectedTopic) {
    showToast("Silakan pilih topik terlebih dahulu.");
    return;
  }
  renderForm(selectedTopic);
  goTo("form");
});

document.getElementById("dynamic-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Tahap frontend awal: siapkan data lokal.
  // Endpoint submit akan kita aktifkan setelah API Apps Script selesai dites.
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  console.log("Data pengajuan:", {
    topic: selectedTopic,
    data
  });

  const generatedId =
    `${selectedTopic.code}/LAPOR-DPUPKP/${formatTimestamp(new Date())}/${Math.floor(10000 + Math.random() * 90000)}`;

  document.getElementById("generated-id").textContent = generatedId;
  event.target.reset();
  goTo("success");
});

document.getElementById("copy-id").addEventListener("click", async () => {
  const id = document.getElementById("generated-id").textContent;
  try {
    await navigator.clipboard.writeText(id);
    showToast("Nomor pengaduan berhasil disalin.");
  } catch {
    showToast("Nomor: " + id);
  }
});

document.getElementById("check-button").addEventListener("click", async () => {
  const id = document.getElementById("tracking-id").value.trim();
  const result = document.getElementById("check-result");

  if (!id) {
    showToast("Masukkan nomor pengaduan.");
    return;
  }

  result.classList.remove("hidden");
  result.innerHTML = `
    <strong>${escapeHtml(id)}</strong>
    <p style="color:#707070; margin-bottom:0;">
      Endpoint pengecekan akan dihubungkan ke Google Apps Script pada tahap berikutnya.
    </p>
  `;
});

function formatTimestamp(date) {
  const pad = n => String(n).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate())
  ].join("") +
  pad(date.getHours()) +
  pad(date.getMinutes()) +
  pad(date.getSeconds());
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

renderTopics();
