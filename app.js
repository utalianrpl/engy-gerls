// ================= DATA SISWA & EVENT =================
const daftarSiswa = [
    "Adler Stradlin J.A",
    "Agusti Dwi Ramadhan",
    "Ahyaar Qolbun Salim",
    "Andrea Ramadhani",
    "Arkhan Rizky Pratama",
    "Aulia Zahrani",
    "Azzam Meidi Akbar",
    "Danendra Sangkara Nayottama",
    "Davin Andika Muharram",
    "Faiz Al-Abrar Rabbany",
    "Fajar Robi'ul Awal",
    "Fathima Putri Mutiaramadhani",
    "Fathiridris Kasyafani Movic",
    "Fauzi Fadhilah",
    "Ghina Asyha Yasmine",
    "Gilang Travis Pratama",
    "Hammada Noury M.",
    "Jamie Caesar H.",
    "Litania Syafitri",
    "Milian Aisya Ridwan",
    "M Farhan Wahyudi",
    "M Reza Ramadhan",
    "Puti Wulandari",
    "Nuri Suci Giadizia",
    "Putra Febriansyah",
    "Putra Ramadhan",
    "Rio Maulana",
    "Rifki Fajar Saputra",
    "Rizki Azka Raharjo",
    "Ruri Himmatul Mudrikah",
    "Sabrina Harfi Arabella",
    "Sahrul Ramadhan",
    "Thrystan Syach F.",
    "Utara Putra Brilliant",
    "Valerie Zouvan Al Baasith",
    "Yusuf Abdul Rosyid"
];

const daftarEvent = [
    "Beli konsumsi", "Acara kelas", "Study tour", 
    "Dekorasi kelas", "Fotokopi", "Lainnya"
];

let currentUserRole = "viewer";

// SET TANGGAL HARI INI SECARA OTOMATIS
function setTanggalHariIni() {
    const tglInput = document.getElementById("tanggalTransaksi");
    if (tglInput) {
        const today = new Date().toISOString().split('T')[0];
        tglInput.value = today;
    }
}

// DROPDOWN NAMA/EVENT & STATUS BAYAR KETIKA TIPE TRANSAKSI BERUBAH
function updateDropdownKeterangan() {
    const jenisSelect = document.getElementById("jenisTransaksi");
    const selectKet = document.getElementById("namaSiswa");
    const statusSelect = document.getElementById("statusBayar");
    
    if (!jenisSelect || !selectKet) return;

    const jenis = jenisSelect.value;
    selectKet.innerHTML = "";

    const listData = (jenis === "masuk") ? daftarSiswa : daftarEvent;

    listData.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item;
        opt.innerText = item;
        selectKet.appendChild(opt);
    });

    if (statusSelect) {
        if (jenis === "keluar") {
            statusSelect.value = "Sudah Bayar";
            statusSelect.disabled = true;
        } else {
            statusSelect.disabled = false;
        }
    }
}

// ================= LOGIN & USER ROLE MANAGEMENT =================

function cekStatusLogin() {
    tampilkanLogin();
}

function tampilkanDashboard(user, role) {
    const loginPage = document.getElementById("loginPage");
    const dashboardPage = document.getElementById("dashboardPage");
    const badge = document.getElementById("userBadge");
    const formPanel = document.getElementById("formPanelBendahara");
    const thAksi = document.getElementById("thAksi");

    if (loginPage) loginPage.style.display = "none";
    if (dashboardPage) dashboardPage.style.display = "flex";

    if (badge) {
        badge.innerText = `User: ${user} (${role.toUpperCase()})`;
        badge.className = "badge " + (role === "bendahara" ? "badge-bendahara" : "badge-viewer");
    }

    if (role === "viewer") {
        if (formPanel) formPanel.style.display = "none";
        if (thAksi) thAksi.style.display = "none";
    } else {
        if (formPanel) formPanel.style.display = "block";
        if (thAksi) thAksi.style.display = "table-cell";
    }

    setTanggalHariIni();
    updateDropdownKeterangan();
    prosesHitungDanMuatUlang();
}

function tampilkanLogin() {
    const loginPage = document.getElementById("loginPage");
    const dashboardPage = document.getElementById("dashboardPage");
    if (loginPage) loginPage.style.display = "flex";
    if (dashboardPage) dashboardPage.style.display = "none";
}

function login() {
    const userEl = document.getElementById("username");
    const passEl = document.getElementById("password");
    const message = document.getElementById("message");

    if (!userEl || !passEl) return;

    const user = userEl.value.trim();
    const pass = passEl.value;

    let accounts = JSON.parse(localStorage.getItem("classLedgerAccounts")) || [];
    let userObj = null;

    if (user === "admin" && pass === "12345") {
        userObj = { username: "admin", role: "bendahara" };
    } else if (user === "viewer" && pass === "12345") {
        userObj = { username: "viewer", role: "viewer" };
    } else {
        userObj = accounts.find(akun => akun.username === user && akun.password === pass);
    }

    if (userObj) {
        if (message) {
            message.style.color = "#7CFF8D";
            message.innerHTML = "✔ Login Berhasil!";
        }

        setTimeout(() => {
            currentUserRole = userObj.role || "viewer";
            tampilkanDashboard(userObj.username, currentUserRole);
        }, 500);
    } else {
        if (message) {
            message.style.color = "#FFD4D4";
            message.innerHTML = "✖ Username / Password Salah";
        }
    }
}

function logout() {
    if (confirm("Apakah Anda yakin ingin logout?")) {
        tampilkanLogin();
    }
}

// ================= BUAT AKUN & LUPA PASSWORD =================

function bukaDaftar() {
    document.getElementById("signupModal").style.display = "flex";
    document.getElementById("signupMessage").innerHTML = "";
}

function tutupDaftar() {
    document.getElementById("signupModal").style.display = "none";
}

function buatAkun() {
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;
    const role = document.getElementById("signupRole").value;
    const message = document.getElementById("signupMessage");

    if (username === "" || password === "" || confirmPassword === "") {
        message.style.color = "#FFD4D4";
        message.innerHTML = "✖ Semua kolom harus diisi.";
        return;
    }

    if (password !== confirmPassword) {
        message.style.color = "#FFD4D4";
        message.innerHTML = "✖ Konfirmasi password tidak cocok.";
        return;
    }

    let accounts = JSON.parse(localStorage.getItem("classLedgerAccounts")) || [];
    if (accounts.some(a => a.username.toLowerCase() === username.toLowerCase())) {
        message.style.color = "#FFD4D4";
        message.innerHTML = "✖ Username sudah digunakan.";
        return;
    }

    accounts.push({ username, password, role });
    localStorage.setItem("classLedgerAccounts", JSON.stringify(accounts));

    message.style.color = "#7CFF8D";
    message.innerHTML = "✔ Akun berhasil dibuat!";

    setTimeout(() => {
        tutupDaftar();
        document.getElementById("username").value = username;
        document.getElementById("password").value = "";
    }, 1000);
}

function bukaLupaPassword() {
    document.getElementById("forgotPasswordModal").style.display = "flex";
    document.getElementById("forgotMessage").innerHTML = "";
}

function tutupLupaPassword() {
    document.getElementById("forgotPasswordModal").style.display = "none";
}

function resetPassword() {
    const username = document.getElementById("forgotUsername").value.trim();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmNewPassword").value;
    const message = document.getElementById("forgotMessage");

    if (!username || !newPassword || !confirmPassword) {
        message.style.color = "#FFD4D4";
        message.innerHTML = "✖ Semua kolom harus diisi.";
        return;
    }

    if (newPassword !== confirmPassword) {
        message.style.color = "#FFD4D4";
        message.innerHTML = "✖ Konfirmasi password tidak cocok.";
        return;
    }

    let accounts = JSON.parse(localStorage.getItem("classLedgerAccounts")) || [];
    const idx = accounts.findIndex(a => a.username.toLowerCase() === username.toLowerCase());

    if (idx === -1) {
        message.style.color = "#FFD4D4";
        message.innerHTML = "✖ Username tidak ditemukan.";
        return;
    }

    accounts[idx].password = newPassword;
    localStorage.setItem("classLedgerAccounts", JSON.stringify(accounts));

    message.style.color = "#7CFF8D";
    message.innerHTML = "✔ Password berhasil diubah!";

    setTimeout(() => {
        tutupLupaPassword();
    }, 1000);
}

// ================= LOGIKA FINANSIAL =================

function catatTransaksiBaru() {
    const nama = document.getElementById("namaSiswa").value;
    const jenis = document.getElementById("jenisTransaksi").value;
    const tanggal = document.getElementById("tanggalTransaksi").value;
    const status = document.getElementById("statusBayar").value;
    const nominal = parseInt(document.getElementById("nominalUang").value);

    if (!nama || !tanggal || isNaN(nominal) || nominal <= 0) {
        alert("Harap lengkapi tanggal dan nominal dengan benar!");
        return;
    }

    const dataTransaksi = {
        id: Date.now(),
        tanggal: tanggal,
        keterangan: nama,
        status: status,
        tipe: jenis,
        jumlah: nominal
    };

    let databaseKas = JSON.parse(localStorage.getItem("classLedgerDB")) || [];
    databaseKas.push(dataTransaksi);
    localStorage.setItem("classLedgerDB", JSON.stringify(databaseKas));

    document.getElementById("nominalUang").value = "";
    prosesHitungDanMuatUlang();
}

function prosesHitungDanMuatUlang() {
    const tbody = document.getElementById("tabelTransaksiBody");
    const saldoDisplay = document.getElementById("totalSaldoDisplay");
    
    if (!tbody) return;

    tbody.innerHTML = "";
    let databaseKas = JSON.parse(localStorage.getItem("classLedgerDB")) || [];
    let akumulasiSaldo = 0;

    if (databaseKas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${currentUserRole === 'bendahara' ? 6 : 5}" style="text-align:center; color:#64748b;">Belum ada riwayat transaksi kas kelas.</td></tr>`;
        if (saldoDisplay) saldoDisplay.innerText = "Rp 0";
        return;
    }

    databaseKas.forEach(item => {
        const baris = document.createElement("tr");

        let simbolTipe = "";
        let classWarna = "";

        if (item.tipe === "masuk") {
            if (item.status === "Sudah Bayar") {
                akumulasiSaldo += item.jumlah;
            }
            simbolTipe = "Masuk";
            classWarna = "masuk";
        } else {
            akumulasiSaldo -= item.jumlah;
            simbolTipe = "Keluar";
            classWarna = "keluar";
        }

        const classStatus = item.status === "Sudah Bayar" ? "status-sudah" : "status-belum";

        let htmlRow = `
            <td>${item.tanggal || '-'}</td>
            <td><strong>${item.keterangan}</strong></td>
            <td><span class="${classStatus}">${item.status || 'Sudah Bayar'}</span></td>
            <td class="${classWarna}">${simbolTipe}</td>
            <td class="${classWarna}">Rp ${item.jumlah.toLocaleString('id-ID')}</td>
        `;

        if (currentUserRole === "bendahara") {
            htmlRow += `<td><span class="btn-hapus" onclick="hapusTransaksi(${item.id})">Hapus</span></td>`;
        }

        baris.innerHTML = htmlRow;
        tbody.appendChild(baris);
    });

    if (saldoDisplay) {
        saldoDisplay.innerText = "Rp " + akumulasiSaldo.toLocaleString('id-ID');
    }
}

function hapusTransaksi(idTarget) {
    if (confirm("Apakah Anda yakin ingin menghapus catatan transaksi ini?")) {
        let databaseKas = JSON.parse(localStorage.getItem("classLedgerDB")) || [];
        databaseKas = databaseKas.filter(item => item.id !== idTarget);
        localStorage.setItem("classLedgerDB", JSON.stringify(databaseKas));
        prosesHitungDanMuatUlang();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    cekStatusLogin();
});
