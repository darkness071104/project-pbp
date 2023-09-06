const GameDifficulty = [50];
class Game {
    reset; // Variabel untuk menyimpan jumlah reset permainan
    cols = 3; // Jumlah kolom dalam teka-teki
    rows = 3; // Jumlah baris dalam teka-teki
    count; // Jumlah total blok dalam teka-teki (kolom * baris)
    blocks; // Variabel untuk menyimpan elemen HTML dengan kelas "puzzle_block"
    emptyBlockCoords = [2, 2]; // Koordinat blok kosong awal
    indexes = []; // Array untuk melacak urutan blok-blok

    constructor(resetgame = 1) {
        this.reset = GameDifficulty[resetgame - 1]; // Mengambil tingkat kesulitan dari array GameDifficulty
        this.count = this.cols * this.rows; // Menghitung jumlah total blok
        this.blocks = document.getElementsByClassName("puzzle_block"); // Mengambil elemen-elemen blok HTML
        this.init(); // Memanggil metode init() untuk menginisialisasi permainan
    }

    init() { // Metode untuk menginisialisasi permainan
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let blockIdx = x + y * this.cols; // Menghitung indeks blok
                if (blockIdx + 1 >= this.count) break; // Memeriksa apakah sudah mencapai batas blok
                let block = this.blocks[blockIdx]; // Mengambil elemen blok
                this.positionBlockAtCoord(blockIdx, x, y); // Memposisikan blok
                block.addEventListener('click', (e) => this.onClickOnBlock(blockIdx)); // Menambahkan event click pada blok
                this.indexes.push(blockIdx); // Menyimpan indeks blok ke dalam array indexes
            }
        }
        this.indexes.push(this.count - 1); // Menambahkan indeks blok kosong ke dalam array indexes
        this.randomize(this.reset); // Mengacak posisi blok-blok
    }

    randomize(iterationCount) { // Mengacak posisi blok-blok sejumlah iterationCount kali
        for (let i = 0; i < iterationCount; i++) {
            let randomBlockIdx = Math.floor(Math.random() * (this.count - 1)); // Memilih indeks blok secara acak
            let moved = this.moveBlock(randomBlockIdx); // Memindahkan blok secara acak
            if (!moved) i--;
        }
    }

    moveBlock(blockIdx) { // Memindahkan blok ke posisi kosong dan mengembalikan true jika berhasil dipindahkan
        let block = this.blocks[blockIdx]; // Mengambil elemen blok
        let blockCoords = this.canMoveBlock(block); // Memeriksa apakah blok dapat dipindahkan
        if (blockCoords != null) {
            this.positionBlockAtCoord(blockIdx, this.emptyBlockCoords[0], this.emptyBlockCoords[1]); // Memposisikan blok ke posisi kosong
            this.indexes[this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols] = this.indexes[blockCoords[0] + blockCoords[1] * this.cols]; // Memperbarui indeks blok dalam array indexes
            this.emptyBlockCoords[0] = blockCoords[0]; // Memperbarui koordinat blok kosong
            this.emptyBlockCoords[1] = blockCoords[1];
            return true; // Mengembalikan true jika blok berhasil dipindahkan
        }
        return false; // Mengembalikan false jika blok tidak dapat dipindahkan
    }

    canMoveBlock(block) { // Memeriksa apakah blok dapat dipindahkan dan mengembalikan koordinat blok jika dapat dipindahkan
        let blockPos = [parseInt(block.style.left), parseInt(block.style.top)]; // Mendapatkan posisi blok
        let blockWidth = block.clientWidth; // Mendapatkan lebar blok
        let blockCoords = [blockPos[0] / blockWidth, blockPos[1] / blockWidth]; // Menghitung koordinat blok
        let diff = [Math.abs(blockCoords[0] - this.emptyBlockCoords[0]), Math.abs(blockCoords[1] - this.emptyBlockCoords[1])]; // Menghitung perbedaan koordinat
        let canMove = (diff[0] == 1 && diff[1] == 0) || (diff[0] == 0 && diff[1] == 1); // Memeriksa apakah blok dapat dipindahkan
        if (canMove) return blockCoords; // Mengembalikan koordinat blok jika dapat dipindahkan
        else return null; // Mengembalikan null jika blok tidak dapat dipindahkan
    }

    positionBlockAtCoord(blockIdx, x, y) { // Memposisikan blok ke koordinat tertentu
        let block = this.blocks[blockIdx]; // Mengambil elemen blok
        block.style.left = (x * block.clientWidth) + "px"; // Mengatur posisi horizontal blok
        block.style.top = (y * block.clientWidth) + "px"; // Mengatur posisi vertikal blok
    }

    onClickOnBlock(blockIdx) { // Menghandle klik pada blok dan memeriksa apakah teka-teki selesai
        if (this.moveBlock(blockIdx)) {
            if (this.checkPuzzleSolved()) {
                setTimeout(() => alert("Teka-teki Selesai!!"), 600); // Menampilkan pesan ketika teka-teki selesai
            }
        }
    }

    checkPuzzleSolved() { // Memeriksa apakah teka-teki selesai
        for (let i = 0; i < this.indexes.length; i++) {
            if (i == this.emptyBlockCoords[0] + this.emptyBlockCoords[1] * this.cols) continue; // Melupakan blok kosong
            if (this.indexes[i] != i) return false; // Mengembalikan false jika urutan blok tidak benar
        }
        return true; // Mengembalikan true jika teka-teki selesai
    }

    setReset(resetgame) { // Mereset permainan dengan tingkat kesulitan baru
        this.reset = GameDifficulty[resetgame - 1]; // Mengambil tingkat kesulitan dari array GameDifficulty
        this.randomize(this.reset); // Mengacak ulang posisi blok-blok
    }
}

var game = new Game(1); // Menginstansiasi permainan dengan tingkat kesulitan awal

// Mengatur tombol reset
var reset_buttons = Array.from(document.getElementsByClassName("reset_button"));
reset_buttons.forEach((elem, idx) => {
    elem.addEventListener('click', (e) => {
        reset_buttons[GameDifficulty.indexOf(game.reset)].classList.remove("active");
        elem.classList.add("active");
        game.setReset(idx + 1);
    });
});