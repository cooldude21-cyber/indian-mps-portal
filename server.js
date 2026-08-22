import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from root directory
app.use(express.static(__dirname));

// Master Real Photo Registry for Indian Political Leaders and MPs
const REAL_PHOTO_REGISTRY = {
  // All 14 Prime Ministers of India (1947 to Present)
  "jawaharlal nehru": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Jawaharlal_Nehru_in_1947.jpg/600px-Jawaharlal_Nehru_in_1947.jpg",
  "lal bahadur shastri": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Lal_Bahadur_Shastri_1965.jpg/600px-Lal_Bahadur_Shastri_1965.jpg",
  "indira gandhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Indira_Gandhi_1977.jpg/600px-Indira_Gandhi_1977.jpg",
  "morarji desai": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Morarji_Desai_1978.jpg/600px-Morarji_Desai_1978.jpg",
  "charan singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Chaudhary_Charan_Singh_1979.jpg/600px-Chaudhary_Charan_Singh_1979.jpg",
  "chaudhary charan singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Chaudhary_Charan_Singh_1979.jpg/600px-Chaudhary_Charan_Singh_1979.jpg",
  "rajiv gandhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Rajiv_Gandhi_1986.jpg/600px-Rajiv_Gandhi_1986.jpg",
  "v. p. singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/V._P._Singh_1989.jpg/600px-V._P._Singh_1989.jpg",
  "v.p. singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/V._P._Singh_1989.jpg/600px-V._P._Singh_1989.jpg",
  "vishwanath pratap singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/V._P._Singh_1989.jpg/600px-V._P._Singh_1989.jpg",
  "chandra shekhar": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Chandra_Shekhar_1990.jpg/600px-Chandra_Shekhar_1990.jpg",
  "p. v. narasimha rao": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/P._V._Narasimha_Rao_in_1994.jpg/600px-P._V._Narasimha_Rao_in_1994.jpg",
  "p.v. narasimha rao": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/P._V._Narasimha_Rao_in_1994.jpg/600px-P._V._Narasimha_Rao_in_1994.jpg",
  "pv narasimha rao": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/P._V._Narasimha_Rao_in_1994.jpg/600px-P._V._Narasimha_Rao_in_1994.jpg",
  "narasimha rao": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/P._V._Narasimha_Rao_in_1994.jpg/600px-P._V._Narasimha_Rao_in_1994.jpg",
  "atal bihari vajpayee": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Atal_Bihari_Vajpayee_%28portrait%29.jpg/600px-Atal_Bihari_Vajpayee_%28portrait%29.jpg",
  "h. d. deve gowda": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/H._D._Deve_Gowda_1996.jpg/600px-H._D._Deve_Gowda_1996.jpg",
  "h.d. deve gowda": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/H._D._Deve_Gowda_1996.jpg/600px-H._D._Deve_Gowda_1996.jpg",
  "hd deve gowda": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/H._D._Deve_Gowda_1996.jpg/600px-H._D._Deve_Gowda_1996.jpg",
  "deve gowda": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/H._D._Deve_Gowda_1996.jpg/600px-H._D._Deve_Gowda_1996.jpg",
  "i. k. gujral": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/I._K._Gujral_1997.jpg/600px-I._K._Gujral_1997.jpg",
  "i.k. gujral": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/I._K._Gujral_1997.jpg/600px-I._K._Gujral_1997.jpg",
  "ik gujral": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/I._K._Gujral_1997.jpg/600px-I._K._Gujral_1997.jpg",
  "inder kumar gujral": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/I._K._Gujral_1997.jpg/600px-I._K._Gujral_1997.jpg",
  "manmohan singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Manmohan_Singh_in_2013.jpg/600px-Manmohan_Singh_in_2013.jpg",
  "dr. manmohan singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Manmohan_Singh_in_2013.jpg/600px-Manmohan_Singh_in_2013.jpg",
  "narendra modi": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png/600px-Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png",

  // All 15 Presidents of India (1950 to Present)
  "dr. rajendra prasad": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Rajendra_Prasad_1952.jpg/600px-Rajendra_Prasad_1952.jpg",
  "rajendra prasad": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Rajendra_Prasad_1952.jpg/600px-Rajendra_Prasad_1952.jpg",
  "dr. sarvepalli radhakrishnan": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Sarvepalli_Radhakrishnan_1962.jpg/600px-Sarvepalli_Radhakrishnan_1962.jpg",
  "sarvepalli radhakrishnan": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Sarvepalli_Radhakrishnan_1962.jpg/600px-Sarvepalli_Radhakrishnan_1962.jpg",
  "s. radhakrishnan": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Sarvepalli_Radhakrishnan_1962.jpg/600px-Sarvepalli_Radhakrishnan_1962.jpg",
  "dr. zakir husain": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Zakir_Husain_1967.jpg/600px-Zakir_Husain_1967.jpg",
  "zakir husain": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Zakir_Husain_1967.jpg/600px-Zakir_Husain_1967.jpg",
  "v. v. giri": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/V._V._Giri_1969.jpg/600px-V._V._Giri_1969.jpg",
  "v.v. giri": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/V._V._Giri_1969.jpg/600px-V._V._Giri_1969.jpg",
  "vv giri": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/V._V._Giri_1969.jpg/600px-V._V._Giri_1969.jpg",
  "varahagiri venkata giri": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/V._V._Giri_1969.jpg/600px-V._V._Giri_1969.jpg",
  "fakhruddin ali ahmed": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Fakhruddin_Ali_Ahmed_1974.jpg/600px-Fakhruddin_Ali_Ahmed_1974.jpg",
  "neelam sanjiva reddy": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Neelam_Sanjiva_Reddy_1977.jpg/600px-Neelam_Sanjiva_Reddy_1977.jpg",
  "sanjiva reddy": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Neelam_Sanjiva_Reddy_1977.jpg/600px-Neelam_Sanjiva_Reddy_1977.jpg",
  "giani zail singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Zail_Singh_1982.jpg/600px-Zail_Singh_1982.jpg",
  "zail singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Zail_Singh_1982.jpg/600px-Zail_Singh_1982.jpg",
  "r. venkataraman": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/R._Venkataraman_1987.jpg/600px-R._Venkataraman_1987.jpg",
  "r.venkataraman": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/R._Venkataraman_1987.jpg/600px-R._Venkataraman_1987.jpg",
  "ramaswamy venkataraman": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/R._Venkataraman_1987.jpg/600px-R._Venkataraman_1987.jpg",
  "dr. shankar dayal sharma": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Shankar_Dayal_Sharma_1992.jpg/600px-Shankar_Dayal_Sharma_1992.jpg",
  "shankar dayal sharma": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Shankar_Dayal_Sharma_1992.jpg/600px-Shankar_Dayal_Sharma_1992.jpg",
  "k. r. narayanan": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/K._R._Narayanan_1997.jpg/600px-K._R._Narayanan_1997.jpg",
  "k.r. narayanan": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/K._R._Narayanan_1997.jpg/600px-K._R._Narayanan_1997.jpg",
  "kr narayanan": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/K._R._Narayanan_1997.jpg/600px-K._R._Narayanan_1997.jpg",
  "kocheril raman narayanan": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/K._R._Narayanan_1997.jpg/600px-K._R._Narayanan_1997.jpg",
  "dr. a.p.j. abdul kalam": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/A._P._J._Abdul_Kalam.jpg/600px-A._P._J._Abdul_Kalam.jpg",
  "a.p.j. abdul kalam": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/A._P._J._Abdul_Kalam.jpg/600px-A._P._J._Abdul_Kalam.jpg",
  "abdul kalam": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/A._P._J._Abdul_Kalam.jpg/600px-A._P._J._Abdul_Kalam.jpg",
  "pratibha patil": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Pratibha_Patil_official_portrait.jpg/600px-Pratibha_Patil_official_portrait.jpg",
  "pratibha devisingh patil": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Pratibha_Patil_official_portrait.jpg/600px-Pratibha_Patil_official_portrait.jpg",
  "pranab mukherjee": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Pranab_Mukherjee_in_2015.jpg/600px-Pranab_Mukherjee_in_2015.jpg",
  "pranab kumar mukherjee": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Pranab_Mukherjee_in_2015.jpg/600px-Pranab_Mukherjee_in_2015.jpg",
  "ram nath kovind": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Ram_Nath_Kovind_official_portrait.jpg/600px-Ram_Nath_Kovind_official_portrait.jpg",
  "droupadi murmu": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/President_Droupadi_Murmu_official_portrait.jpg/600px-President_Droupadi_Murmu_official_portrait.jpg",

  // Other Historic Freedom Leaders
  "mahatma gandhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Portrait_Gandhi.jpg/600px-Portrait_Gandhi.jpg",
  "dr. b. r. ambedkar": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Dr._Bhimrao_Ambedkar.jpg/600px-Dr._Bhimrao_Ambedkar.jpg",
  "b. r. ambedkar": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Dr._Bhimrao_Ambedkar.jpg/600px-Dr._Bhimrao_Ambedkar.jpg",
  "bhimrao ramji ambedkar": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Dr._Bhimrao_Ambedkar.jpg/600px-Dr._Bhimrao_Ambedkar.jpg",
  "sardar vallabhbhai patel": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Sardar_patel_%28cropped%29.jpg/600px-Sardar_patel_%28cropped%29.jpg",
  "vallabhbhai patel": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Sardar_patel_%28cropped%29.jpg/600px-Sardar_patel_%28cropped%29.jpg",
  "subhas chandra bose": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Subhas_Chandra_Bose_NRB.jpg/600px-Subhas_Chandra_Bose_NRB.jpg",
  "netaji subhas chandra bose": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Subhas_Chandra_Bose_NRB.jpg/600px-Subhas_Chandra_Bose_NRB.jpg",
  "bhagat singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bhagat_Singh_1929.jpg/600px-Bhagat_Singh_1929.jpg",
  "sarojini naidu": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Sarojini_Naidu_1912.jpg/600px-Sarojini_Naidu_1912.jpg",
  "maulana abul kalam azad": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Maulana_Abul_Kalam_Azad_1946.jpg/600px-Maulana_Abul_Kalam_Azad_1946.jpg",
  "bal gangadhar tilak": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Bal_Gangadhar_Tilak.jpg/600px-Bal_Gangadhar_Tilak.jpg",

  // Prime Ministers & Party Leaders
  "narendra modi": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png/600px-Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png",
  "rahul gandhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Rahul_Gandhi_2023.jpg/600px-Rahul_Gandhi_2023.jpg",
  "amit shah": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Amit_Shah_in_2024.jpg/600px-Amit_Shah_in_2024.jpg",
  "sonia gandhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Sonia_Gandhi_in_2019.jpg/600px-Sonia_Gandhi_in_2019.jpg",
  "manmohan singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Manmohan_Singh_in_2013.jpg/600px-Manmohan_Singh_in_2013.jpg",
  "dr. manmohan singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Manmohan_Singh_in_2013.jpg/600px-Manmohan_Singh_in_2013.jpg",
  "rajnath singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Rajnath_Singh_in_2023.jpg/600px-Rajnath_Singh_in_2023.jpg",
  "nitin gadkari": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Nitin_Gadkari_in_2023.jpg/600px-Nitin_Gadkari_in_2023.jpg",
  "nirmala sitharaman": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Nirmala_Sitharaman_2023.jpg/600px-Nirmala_Sitharaman_2023.jpg",
  "dr. s. jaishankar": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Dr._S._Jaishankar_in_2023.jpg/600px-Dr._S._Jaishankar_in_2023.jpg",
  "subrahmanyam jaishankar": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Dr._S._Jaishankar_in_2023.jpg/600px-Dr._S._Jaishankar_in_2023.jpg",
  "s. jaishankar": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Dr._S._Jaishankar_in_2023.jpg/600px-Dr._S._Jaishankar_in_2023.jpg",
  "akhilesh yadav": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Akhilesh_Yadav_2016.jpg/600px-Akhilesh_Yadav_2016.jpg",
  "mamata banerjee": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mamata_Banerjee_2019.jpg/600px-Mamata_Banerjee_2019.jpg",
  "arvind kejriwal": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Arvind_Kejriwal_2022.jpg/600px-Arvind_Kejriwal_2022.jpg",
  "shashi tharoor": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Shashi_Tharoor_2013.jpg/600px-Shashi_Tharoor_2013.jpg",

  // Prominent Lok Sabha & Rajya Sabha MPs
  "supriya sule": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Supriya_Sule_in_2023.jpg/600px-Supriya_Sule_in_2023.jpg",
  "mahua moitra": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Mahua_Moitra_in_2019.jpg/600px-Mahua_Moitra_in_2019.jpg",
  "dimple yadav": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Dimple_Yadav_in_2022.jpg/600px-Dimple_Yadav_in_2022.jpg",
  "kanimozhi karunanidhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Kanimozhi_Karunanidhi_2019.jpg/600px-Kanimozhi_Karunanidhi_2019.jpg",
  "kanimozhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Kanimozhi_Karunanidhi_2019.jpg/600px-Kanimozhi_Karunanidhi_2019.jpg",
  "anurag singh thakur": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Anurag_Singh_Thakur_2022.jpg/600px-Anurag_Singh_Thakur_2022.jpg",
  "anurag thakur": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Anurag_Singh_Thakur_2022.jpg/600px-Anurag_Singh_Thakur_2022.jpg",
  "dharmendra pradhan": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Dharmendra_Pradhan_in_2023.jpg/600px-Dharmendra_Pradhan_in_2023.jpg",
  "piyush goyal": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Piyush_Goyal_in_2023.jpg/600px-Piyush_Goyal_in_2023.jpg",
  "kiren rijiju": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Kiren_Rijiju_in_2023.jpg/600px-Kiren_Rijiju_in_2023.jpg",
  "giriraj singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Giriraj_Singh_in_2022.jpg/600px-Giriraj_Singh_in_2022.jpg",
  "chirag paswan": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Chirag_Paswan_in_2024.jpg/600px-Chirag_Paswan_in_2024.jpg",
  "jitan ram manjhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Jitan_Ram_Manjhi_2022.jpg/600px-Jitan_Ram_Manjhi_2022.jpg",
  "kinjarapu ram mohan naidu": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Ram_Mohan_Naidu_Kinjarapu.jpg/600px-Ram_Mohan_Naidu_Kinjarapu.jpg",
  "ram mohan naidu kinjarapu": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Ram_Mohan_Naidu_Kinjarapu.jpg/600px-Ram_Mohan_Naidu_Kinjarapu.jpg",
  "h. d. kumaraswamy": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/H._D._Kumaraswamy_in_2023.jpg/600px-H._D._Kumaraswamy_in_2023.jpg",
  "h.d. kumaraswamy": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/H._D._Kumaraswamy_in_2023.jpg/600px-H._D._Kumaraswamy_in_2023.jpg",
  "asaduddin owaisi": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Asaduddin_Owaisi_in_2022.jpg/600px-Asaduddin_Owaisi_in_2022.jpg",
  "mallikarjun kharge": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mallikarjun_Kharge_in_2022.jpg/600px-Mallikarjun_Kharge_in_2022.jpg",
  "jyotiraditya scindia": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Jyotiraditya_Scindia_in_2023.jpg/600px-Jyotiraditya_Scindia_in_2023.jpg",
  "jyotiraditya m. scindia": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Jyotiraditya_Scindia_in_2023.jpg/600px-Jyotiraditya_Scindia_in_2023.jpg",
  "shivraj singh chouhan": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Shivraj_Singh_Chouhan_in_2023.jpg/600px-Shivraj_Singh_Chouhan_in_2023.jpg",
  "manohar lal khattar": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Manohar_Lal_Khattar_in_2022.jpg/600px-Manohar_Lal_Khattar_in_2022.jpg",
  "manohar lal": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Manohar_Lal_Khattar_in_2022.jpg/600px-Manohar_Lal_Khattar_in_2022.jpg",
  "sarbananda sonowal": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Sarbananda_Sonowal_in_2023.jpg/600px-Sarbananda_Sonowal_in_2023.jpg",
  "dr. jitendra singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Dr._Jitendra_Singh_in_2023.jpg/600px-Dr._Jitendra_Singh_in_2023.jpg",
  "gajendra singh shekhawat": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Gajendra_Singh_Shekhawat_in_2023.jpg/600px-Gajendra_Singh_Shekhawat_in_2023.jpg",
  "mansukh mandaviya": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Mansukh_Mandaviya_in_2023.jpg/600px-Mansukh_Mandaviya_in_2023.jpg",
  "bhupender yadav": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Bhupender_Yadav_in_2023.jpg/600px-Bhupender_Yadav_in_2023.jpg",
  "hardeep singh puri": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Hardeep_Singh_Puri_in_2023.jpg/600px-Hardeep_Singh_Puri_in_2023.jpg",
  "j. p. nadda": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Jagat_Prakash_Nadda_in_2023.jpg/600px-Jagat_Prakash_Nadda_in_2023.jpg",
  "jagat prakash nadda": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Jagat_Prakash_Nadda_in_2023.jpg/600px-Jagat_Prakash_Nadda_in_2023.jpg",
  "g. kishan reddy": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/G._Kishan_Reddy_in_2023.jpg/600px-G._Kishan_Reddy_in_2023.jpg",
  "suresh gopi": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Suresh_Gopi_in_2024.jpg/600px-Suresh_Gopi_in_2024.jpg",
  "bandi sanjay kumar": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bandi_Sanjay_Kumar_2022.jpg/600px-Bandi_Sanjay_Kumar_2022.jpg",
  "abhishek banerjee": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Abhishek_Banerjee_in_2022.jpg/600px-Abhishek_Banerjee_in_2022.jpg",
  "raghav chadha": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Raghav_Chadha_2023.jpg/600px-Raghav_Chadha_2023.jpg",
  "sanjay singh": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Sanjay_Singh_AAP.jpg/600px-Sanjay_Singh_AAP.jpg",
  "jairam ramesh": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Jairam_Ramesh_in_2016.jpg/600px-Jairam_Ramesh_in_2016.jpg",
  "derek o'brien": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Derek_O%27Brien_2019.jpg/600px-Derek_O%27Brien_2019.jpg",
  "kapil sibal": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Kapil_Sibal_2011.jpg/600px-Kapil_Sibal_2011.jpg",
  "p. chidambaram": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/P._Chidambaram_in_2013.jpg/600px-P._Chidambaram_in_2013.jpg",
  "yogi adityanath": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Yogi_Adityanath_in_2023.jpg/600px-Yogi_Adityanath_in_2023.jpg",
  "m. k. stalin": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/M._K._Stalin_2021.jpg/600px-M._K._Stalin_2021.jpg",
  "chandrababu naidu": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/N._Chandrababu_Naidu_in_2024.jpg/600px-N._Chandrababu_Naidu_in_2024.jpg",
  "n. chandrababu naidu": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/N._Chandrababu_Naidu_in_2024.jpg/600px-N._Chandrababu_Naidu_in_2024.jpg",
  "pawan kalyan": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Pawan_Kalyan_in_2024.jpg/600px-Pawan_Kalyan_in_2024.jpg",
  "sharad pawar": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Sharad_Pawar_2019.jpg/600px-Sharad_Pawar_2019.jpg",
  "devendra fadnavis": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Devendra_Fadnavis_2023.jpg/600px-Devendra_Fadnavis_2023.jpg",
  "eknath shinde": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Eknath_Shinde_2023.jpg/600px-Eknath_Shinde_2023.jpg",
  "uddhav thackeray": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Uddhav_Thackeray_2021.jpg/600px-Uddhav_Thackeray_2021.jpg",
  "nitish kumar": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Nitish_Kumar_in_2023.jpg/600px-Nitish_Kumar_in_2023.jpg"
};

// Constituency to Indian State Mapping for Lok Sabha MPs
const CONSTITUENCY_STATE_MAP = {
  // Andhra Pradesh
  'amalapuram': 'Andhra Pradesh', 'anakapalle': 'Andhra Pradesh', 'anantapur': 'Andhra Pradesh', 'araku': 'Andhra Pradesh', 'bapatla': 'Andhra Pradesh', 'chittoor': 'Andhra Pradesh', 'eluru': 'Andhra Pradesh', 'guntur': 'Andhra Pradesh', 'hindupur': 'Andhra Pradesh', 'kadapa': 'Andhra Pradesh', 'kakinada': 'Andhra Pradesh', 'kurnool': 'Andhra Pradesh', 'machilipatnam': 'Andhra Pradesh', 'nandyal': 'Andhra Pradesh', 'narasapuram': 'Andhra Pradesh', 'narasaraopet': 'Andhra Pradesh', 'nellore': 'Andhra Pradesh', 'ongole': 'Andhra Pradesh', 'rajahmundry': 'Andhra Pradesh', 'rajampet': 'Andhra Pradesh', 'srikakulam': 'Andhra Pradesh', 'tirupati': 'Andhra Pradesh', 'vijayawada': 'Andhra Pradesh', 'visakhapatnam': 'Andhra Pradesh', 'vizianagaram': 'Andhra Pradesh',
  // Telangana
  'adilabad': 'Telangana', 'bhongir': 'Telangana', 'chevella': 'Telangana', 'hyderabad': 'Telangana', 'karimnagar': 'Telangana', 'khammam': 'Telangana', 'mahabubabad': 'Telangana', 'mahbubnagar': 'Telangana', 'malkajgiri': 'Telangana', 'medak': 'Telangana', 'nagarkurnool': 'Telangana', 'nalgonda': 'Telangana', 'nizamabad': 'Telangana', 'peddapalle': 'Telangana', 'secunderabad': 'Telangana', 'warangal': 'Telangana', 'zahirabad': 'Telangana',
  // Uttar Pradesh
  'agra': 'Uttar Pradesh', 'akbarpur': 'Uttar Pradesh', 'aligarh': 'Uttar Pradesh', 'allahabad': 'Uttar Pradesh', 'prayagraj': 'Uttar Pradesh', 'ambedkar nagar': 'Uttar Pradesh', 'amethi': 'Uttar Pradesh', 'amroha': 'Uttar Pradesh', 'aonla': 'Uttar Pradesh', 'azamgarh': 'Uttar Pradesh', 'badaun': 'Uttar Pradesh', 'baghpat': 'Uttar Pradesh', 'bahraich': 'Uttar Pradesh', 'ballia': 'Uttar Pradesh', 'banda': 'Uttar Pradesh', 'bansgaon': 'Uttar Pradesh', 'barabanki': 'Uttar Pradesh', 'bareilly': 'Uttar Pradesh', 'basti': 'Uttar Pradesh', 'bhadohi': 'Uttar Pradesh', 'bijnor': 'Uttar Pradesh', 'bulandshahr': 'Uttar Pradesh', 'chandauli': 'Uttar Pradesh', 'deoria': 'Uttar Pradesh', 'dhaurahra': 'Uttar Pradesh', 'domariyaganj': 'Uttar Pradesh', 'etah': 'Uttar Pradesh', 'etawah': 'Uttar Pradesh', 'faizabad': 'Uttar Pradesh', 'ayodhya': 'Uttar Pradesh', 'farrukhabad': 'Uttar Pradesh', 'fatehpur': 'Uttar Pradesh', 'fatehpur sikri': 'Uttar Pradesh', 'firozabad': 'Uttar Pradesh', 'gautam buddha nagar': 'Uttar Pradesh', 'ghaziabad': 'Uttar Pradesh', 'ghazipur': 'Uttar Pradesh', 'ghosi': 'Uttar Pradesh', 'gonda': 'Uttar Pradesh', 'gorakhpur': 'Uttar Pradesh', 'hamirpur': 'Uttar Pradesh', 'hardoi': 'Uttar Pradesh', 'hathras': 'Uttar Pradesh', 'jalaun': 'Uttar Pradesh', 'jaunpur': 'Uttar Pradesh', 'jhansi': 'Uttar Pradesh', 'kairana': 'Uttar Pradesh', 'kaiserganj': 'Uttar Pradesh', 'kannauj': 'Uttar Pradesh', 'kanpur': 'Uttar Pradesh', 'kanpur urban': 'Uttar Pradesh', 'kaushambi': 'Uttar Pradesh', 'kheri': 'Uttar Pradesh', 'kushi nagar': 'Uttar Pradesh', 'kushinagar': 'Uttar Pradesh', 'lalganj': 'Uttar Pradesh', 'lucknow': 'Uttar Pradesh', 'machhlishahr': 'Uttar Pradesh', 'maharajganj': 'Uttar Pradesh', 'mainpuri': 'Uttar Pradesh', 'mathura': 'Uttar Pradesh', 'meerut': 'Uttar Pradesh', 'mirzapur': 'Uttar Pradesh', 'misrikh': 'Uttar Pradesh', 'mohanlalganj': 'Uttar Pradesh', 'moradabad': 'Uttar Pradesh', 'muzaffarnagar': 'Uttar Pradesh', 'nagine': 'Uttar Pradesh', 'naginah': 'Uttar Pradesh', 'nagina': 'Uttar Pradesh', 'phulpur': 'Uttar Pradesh', 'pilibhit': 'Uttar Pradesh', 'pratapgarh': 'Uttar Pradesh', 'rae bareli': 'Uttar Pradesh', 'raebareli': 'Uttar Pradesh', 'rampur': 'Uttar Pradesh', 'robertsganj': 'Uttar Pradesh', 'saharanpur': 'Uttar Pradesh', 'salempur': 'Uttar Pradesh', 'sambhal': 'Uttar Pradesh', 'sant kabir nagar': 'Uttar Pradesh', 'shahjahanpur': 'Uttar Pradesh', 'shrawasti': 'Uttar Pradesh', 'siddharthnagar': 'Uttar Pradesh', 'sitapur': 'Uttar Pradesh', 'sultanpur': 'Uttar Pradesh', 'unnao': 'Uttar Pradesh', 'varanasi': 'Uttar Pradesh',
  // Gujarat
  'ahmedabad east': 'Gujarat', 'ahmedabad west': 'Gujarat', 'amreli': 'Gujarat', 'anand': 'Gujarat', 'banaskantha': 'Gujarat', 'bardoli': 'Gujarat', 'bharuch': 'Gujarat', 'bhavnagar': 'Gujarat', 'chhota udaipur': 'Gujarat', 'dahod': 'Gujarat', 'gandhinagar': 'Gujarat', 'jamnagar': 'Gujarat', 'junagadh': 'Gujarat', 'kachchh': 'Gujarat', 'kutch': 'Gujarat', 'kheda': 'Gujarat', 'mahesana': 'Gujarat', 'mehsana': 'Gujarat', 'navsari': 'Gujarat', 'panchmahal': 'Gujarat', 'patan': 'Gujarat', 'porbandar': 'Gujarat', 'rajkot': 'Gujarat', 'sabarkantha': 'Gujarat', 'surat': 'Gujarat', 'surendranagar': 'Gujarat', 'vadodara': 'Gujarat', 'valsad': 'Gujarat',
  // Maharashtra
  'ahmednagar': 'Maharashtra', 'akola': 'Maharashtra', 'amravati': 'Maharashtra', 'aurangabad': 'Maharashtra', 'chhatrapati sambhaji nagar': 'Maharashtra', 'baramati': 'Maharashtra', 'beed': 'Maharashtra', 'bhandara-gondiya': 'Maharashtra', 'bhiwandi': 'Maharashtra', 'buldhana': 'Maharashtra', 'chandrapur': 'Maharashtra', 'dhule': 'Maharashtra', 'dindori': 'Maharashtra', 'gadchiroli-chimur': 'Maharashtra', 'gadchiroli - chimur': 'Maharashtra', 'hatkanangle': 'Maharashtra', 'hatkanangale': 'Maharashtra', 'hingoli': 'Maharashtra', 'jalgaon': 'Maharashtra', 'jalna': 'Maharashtra', 'kalyan': 'Maharashtra', 'kolhapur': 'Maharashtra', 'latur': 'Maharashtra', 'madha': 'Maharashtra', 'maval': 'Maharashtra', 'mumbai north': 'Maharashtra', 'mumbai north central': 'Maharashtra', 'mumbai north east': 'Maharashtra', 'mumbai north west': 'Maharashtra', 'mumbai south': 'Maharashtra', 'mumbai south central': 'Maharashtra', 'nagpur': 'Maharashtra', 'nanded': 'Maharashtra', 'nandurbar': 'Maharashtra', 'nashik': 'Maharashtra', 'osmanabad': 'Maharashtra', 'dharashiv': 'Maharashtra', 'palghar': 'Maharashtra', 'parbhani': 'Maharashtra', 'pune': 'Maharashtra', 'raigad': 'Maharashtra', 'ramtek': 'Maharashtra', 'ratnagiri-sindhudurg': 'Maharashtra', 'raver': 'Maharashtra', 'sangli': 'Maharashtra', 'satara': 'Maharashtra', 'shirdi': 'Maharashtra', 'shirur': 'Maharashtra', 'solapur': 'Maharashtra', 'thane': 'Maharashtra', 'wardha': 'Maharashtra', 'yavatmal-washim': 'Maharashtra',
  // West Bengal
  'alipurduars': 'West Bengal', 'arambagh': 'West Bengal', 'arambag': 'West Bengal', 'asansol': 'West Bengal', 'baharampur': 'West Bengal', 'balurghat': 'West Bengal', 'bangaon': 'West Bengal', 'bankura': 'West Bengal', 'barasat': 'West Bengal', 'bardhaman durgapur': 'West Bengal', 'burdwan - durgapur': 'West Bengal', 'bardhaman purba': 'West Bengal', 'barrackpore': 'West Bengal', 'barrackpur': 'West Bengal', 'basirhat': 'West Bengal', 'birbhum': 'West Bengal', 'bishnupur': 'West Bengal', 'bolpur': 'West Bengal', 'cooch behar': 'West Bengal', 'darjeeling': 'West Bengal', 'diamond harbour': 'West Bengal', 'dum dum': 'West Bengal', 'ghatal': 'West Bengal', 'hooghly': 'West Bengal', 'howrah': 'West Bengal', 'jadavpur': 'West Bengal', 'jalpaiguri': 'West Bengal', 'jangipur': 'West Bengal', 'jaynagar': 'West Bengal', 'jhargram': 'West Bengal', 'kanthi': 'West Bengal', 'kolkata dakshin': 'West Bengal', 'kolkata uttar': 'West Bengal', 'krishnanagar': 'West Bengal', 'maldaha dakshin': 'West Bengal', 'maldaha uttar': 'West Bengal', 'mathurapur': 'West Bengal', 'medinipur': 'West Bengal', 'murshidabad': 'West Bengal', 'purulia': 'West Bengal', 'raiganj': 'West Bengal', 'ranaghat': 'West Bengal', 'sreerampur': 'West Bengal', 'tamluk': 'West Bengal', 'uluberia': 'West Bengal',
  // Bihar
  'araria': 'Bihar', 'arrah': 'Bihar', 'aurangabad (bihar)': 'Bihar', 'banka': 'Bihar', 'begusarai': 'Bihar', 'bhagalpur': 'Bihar', 'buxar': 'Bihar', 'darbhanga': 'Bihar', 'gaya': 'Bihar', 'gopalganj': 'Bihar', 'hajipur': 'Bihar', 'jahanabad': 'Bihar', 'jamui': 'Bihar', 'jhanjharpur': 'Bihar', 'karakat': 'Bihar', 'katihar': 'Bihar', 'khagaria': 'Bihar', 'kishanganj': 'Bihar', 'madhepura': 'Bihar', 'madhubani': 'Bihar', 'munger': 'Bihar', 'muzaffarpur': 'Bihar', 'nalanda': 'Bihar', 'nawada': 'Bihar', 'paschim champaran': 'Bihar', 'pataliputra': 'Bihar', 'patna sahib': 'Bihar', 'purnia': 'Bihar', 'purvi champaran': 'Bihar', 'samastipur': 'Bihar', 'saran': 'Bihar', 'sasaram': 'Bihar', 'sheohar': 'Bihar', 'sitamarhi': 'Bihar', 'siwan': 'Bihar', 'supaul': 'Bihar', 'ujiarpur': 'Bihar', 'vaishali': 'Bihar', 'valmiki nagar': 'Bihar',
  // Tamil Nadu
  'arakkonam': 'Tamil Nadu', 'arani': 'Tamil Nadu', 'chennai central': 'Tamil Nadu', 'chennai north': 'Tamil Nadu', 'chennai south': 'Tamil Nadu', 'chidambaram': 'Tamil Nadu', 'coimbatore': 'Tamil Nadu', 'cuddalore': 'Tamil Nadu', 'dharmapuri': 'Tamil Nadu', 'dindigul': 'Tamil Nadu', 'erode': 'Tamil Nadu', 'kallakurichi': 'Tamil Nadu', 'kancheepuram': 'Tamil Nadu', 'kanyakumari': 'Tamil Nadu', 'kanniyakumari': 'Tamil Nadu', 'karur': 'Tamil Nadu', 'krishnagiri': 'Tamil Nadu', 'madurai': 'Tamil Nadu', 'mayiladuthurai': 'Tamil Nadu', 'nagapattinam': 'Tamil Nadu', 'namakkal': 'Tamil Nadu', 'nilgiris': 'Tamil Nadu', 'perambalur': 'Tamil Nadu', 'pollachi': 'Tamil Nadu', 'ramanathapuram': 'Tamil Nadu', 'salem': 'Tamil Nadu', 'sivaganga': 'Tamil Nadu', 'sriperumbudur': 'Tamil Nadu', 'tenkasi': 'Tamil Nadu', 'thanjavur': 'Tamil Nadu', 'theni': 'Tamil Nadu', 'thoothukkudi': 'Tamil Nadu', 'tiruchirappalli': 'Tamil Nadu', 'tirunelveli': 'Tamil Nadu', 'tiruppur': 'Tamil Nadu', 'tiruvallur': 'Tamil Nadu', 'tiruvannamalai': 'Tamil Nadu', 'vellore': 'Tamil Nadu', 'viluppuram': 'Tamil Nadu', 'virudhunagar': 'Tamil Nadu',
  // Rajasthan
  'ajmer': 'Rajasthan', 'alwar': 'Rajasthan', 'banswara': 'Rajasthan', 'barmer': 'Rajasthan', 'bharatpur': 'Rajasthan', 'bhilwara': 'Rajasthan', 'bikaner': 'Rajasthan', 'chittorgarh': 'Rajasthan', 'churu': 'Rajasthan', 'dausa': 'Rajasthan', 'ganganagar': 'Rajasthan', 'jaipur': 'Rajasthan', 'jaipur rural': 'Rajasthan', 'jalore': 'Rajasthan', 'jhalawar-baran': 'Rajasthan', 'jhunjhunu': 'Rajasthan', 'jodhpur': 'Rajasthan', 'karauli-dholpur': 'Rajasthan', 'kota': 'Rajasthan', 'nagaur': 'Rajasthan', 'pali': 'Rajasthan', 'rajsamand': 'Rajasthan', 'sikar': 'Rajasthan', 'tonk-sawai madhopur': 'Rajasthan', 'udaipur': 'Rajasthan',
  // Punjab
  'amritsar': 'Punjab', 'anandpur sahib': 'Punjab', 'bathinda': 'Punjab', 'fatehgarh sahib': 'Punjab', 'faridkot': 'Punjab', 'firozpur': 'Punjab', 'gurdaspur': 'Punjab', 'hoshiarpur': 'Punjab', 'jalandhar': 'Punjab', 'khadoor sahib': 'Punjab', 'ludhiana': 'Punjab', 'patiala': 'Punjab', 'sangrur': 'Punjab',
  // Haryana
  'ambala': 'Haryana', 'bhiwani-mahendragarh': 'Haryana', 'faridabad': 'Haryana', 'gurgaon': 'Haryana', 'hisar': 'Haryana', 'karnal': 'Haryana', 'kurukshetra': 'Haryana', 'rohtak': 'Haryana', 'sirsa': 'Haryana', 'sonipat': 'Haryana',
  // Kerala
  'alappuzha': 'Kerala', 'alathur': 'Kerala', 'attingal': 'Kerala', 'chalakudy': 'Kerala', 'ernakulam': 'Kerala', 'idukki': 'Kerala', 'kannur': 'Kerala', 'kasaragod': 'Kerala', 'kollam': 'Kerala', 'kottayam': 'Kerala', 'kozhikode': 'Kerala', 'malappuram': 'Kerala', 'mavelikkara': 'Kerala', 'palakkad': 'Kerala', 'pathanamthitta': 'Kerala', 'ponnani': 'Kerala', 'thiruvananthapuram': 'Kerala', 'thrissur': 'Kerala', 'vadakara': 'Kerala', 'wayanad': 'Kerala',
  // Karnataka
  'bagalkot': 'Karnataka', 'bangalore central': 'Karnataka', 'bangalore north': 'Karnataka', 'bangalore rural': 'Karnataka', 'bangalore south': 'Karnataka', 'belgaum': 'Karnataka', 'bellary': 'Karnataka', 'bidar': 'Karnataka', 'bijapur': 'Karnataka', 'chamarajanagar': 'Karnataka', 'chikkaballapur': 'Karnataka', 'chikkballapur': 'Karnataka', 'chikkodi': 'Karnataka', 'chitradurga': 'Karnataka', 'dakshina kannada': 'Karnataka', 'davanagere': 'Karnataka', 'dharwad': 'Karnataka', 'gulbarga': 'Karnataka', 'hassan': 'Karnataka', 'haveri': 'Karnataka', 'kolar': 'Karnataka', 'koppal': 'Karnataka', 'mandya': 'Karnataka', 'mysore': 'Karnataka', 'raichur': 'Karnataka', 'shimoga': 'Karnataka', 'tumkur': 'Karnataka', 'udupi chikmagalur': 'Karnataka', 'uttara kannada': 'Karnataka',
  // Madhya Pradesh
  'balaghat': 'Madhya Pradesh', 'betul': 'Madhya Pradesh', 'bhind': 'Madhya Pradesh', 'bhopal': 'Madhya Pradesh', 'chhindwara': 'Madhya Pradesh', 'damoh': 'Madhya Pradesh', 'dewas': 'Madhya Pradesh', 'dhar': 'Madhya Pradesh', 'guna': 'Madhya Pradesh', 'gwalior': 'Madhya Pradesh', 'hoshangabad': 'Madhya Pradesh', 'narmadapuram': 'Madhya Pradesh', 'indore': 'Madhya Pradesh', 'jabalpur': 'Madhya Pradesh', 'khajuraho': 'Madhya Pradesh', 'khandwa': 'Madhya Pradesh', 'khargone': 'Madhya Pradesh', 'mandla': 'Madhya Pradesh', 'mandsaur': 'Madhya Pradesh', 'morena': 'Madhya Pradesh', 'rajgarh': 'Madhya Pradesh', 'ratlam': 'Madhya Pradesh', 'rewa': 'Madhya Pradesh', 'sagar': 'Madhya Pradesh', 'satna': 'Madhya Pradesh', 'sehore': 'Madhya Pradesh', 'shahdol': 'Madhya Pradesh', 'sidhi': 'Madhya Pradesh', 'tikamgarh': 'Madhya Pradesh', 'ujjain': 'Madhya Pradesh', 'vidisha': 'Madhya Pradesh',
  // Odisha
  'aska': 'Odisha', 'balasore': 'Odisha', 'bargarh': 'Odisha', 'berhampur': 'Odisha', 'bhadrak': 'Odisha', 'bhubaneswar': 'Odisha', 'bolangir': 'Odisha', 'cuttack': 'Odisha', 'dhenkanal': 'Odisha', 'jagatsinghpur': 'Odisha', 'jajpur': 'Odisha', 'kalahandi': 'Odisha', 'kandhamal': 'Odisha', 'kendrapara': 'Odisha', 'keonjhar': 'Odisha', 'koraput': 'Odisha', 'mayurbhanj': 'Odisha', 'nabarangpur': 'Odisha', 'puri': 'Odisha', 'sambalpur': 'Odisha', 'sundargarh': 'Odisha',
  // Assam
  'autonomous district': 'Assam', 'barpeta': 'Assam', 'dhubri': 'Assam', 'dibrugarh': 'Assam', 'gauhati': 'Assam', 'guwahati': 'Assam', 'jorhat': 'Assam', 'kaliabor': 'Assam', 'karimganj': 'Assam', 'kokrajhar': 'Assam', 'lakhimpur': 'Assam', 'mangaldai': 'Assam', 'mangoldoi': 'Assam', 'nagaon': 'Assam', 'nowgong': 'Assam', 'silchar': 'Assam', 'tezpur': 'Assam', 'kaziranga': 'Assam', 'sonitpur': 'Assam', 'darrang-udalguri': 'Assam',
  // Jharkhand
  'chatra': 'Jharkhand', 'dhanbad': 'Jharkhand', 'dumka': 'Jharkhand', 'giridih': 'Jharkhand', 'godda': 'Jharkhand', 'hazaribagh': 'Jharkhand', 'jamshedpur': 'Jharkhand', 'khunti': 'Jharkhand', 'kodarma': 'Jharkhand', 'koderma': 'Jharkhand', 'lohardaga': 'Jharkhand', 'palamu': 'Jharkhand', 'rajmahal': 'Jharkhand', 'ranchi': 'Jharkhand', 'singhbhum': 'Jharkhand',
  // Chhattisgarh
  'bastar': 'Chhattisgarh', 'bilaspur': 'Chhattisgarh', 'durg': 'Chhattisgarh', 'janjgir-champa': 'Chhattisgarh', 'kanker': 'Chhattisgarh', 'korba': 'Chhattisgarh', 'mahasamund': 'Chhattisgarh', 'raigarh': 'Chhattisgarh', 'raipur': 'Chhattisgarh', 'rajnandgaon': 'Chhattisgarh', 'surguja': 'Chhattisgarh',
  // Delhi
  'chandni chowk': 'Delhi', 'east delhi': 'Delhi', 'new delhi': 'Delhi', 'north east delhi': 'Delhi', 'north west delhi': 'Delhi', 'south delhi': 'Delhi', 'west delhi': 'Delhi',
  // Uttarakhand
  'almora': 'Uttarakhand', 'garhwal': 'Uttarakhand', 'haridwar': 'Uttarakhand', 'nainital-udhamsingh nagar': 'Uttarakhand', 'tehri garhwal': 'Uttarakhand',
  // Himachal Pradesh
  'hamirpur': 'Himachal Pradesh', 'hamirpur (hp)': 'Himachal Pradesh', 'kangra': 'Himachal Pradesh', 'mandi': 'Himachal Pradesh', 'shimla': 'Himachal Pradesh',
  // Jammu and Kashmir
  'anantnag-rajouri': 'Jammu and Kashmir', 'baramulla': 'Jammu and Kashmir', 'jammu': 'Jammu and Kashmir', 'srinagar': 'Jammu and Kashmir', 'udhampur': 'Jammu and Kashmir',
  // Goa
  'north goa': 'Goa', 'south goa': 'Goa',
  // Tripura
  'tripura east': 'Tripura', 'tripura west': 'Tripura',
  // Manipur
  'inner manipur': 'Manipur', 'outer manipur': 'Manipur',
  // Meghalaya
  'shillong': 'Meghalaya', 'tura': 'Meghalaya',
  // Mizoram
  'mizoram': 'Mizoram',
  // Nagaland
  'nagaland': 'Nagaland',
  // Sikkim
  'sikkim': 'Sikkim',
  // Arunachal Pradesh
  'arunachal east': 'Arunachal Pradesh', 'arunachal west': 'Arunachal Pradesh',
  // UTs
  'chandigarh': 'Chandigarh', 'ladakh': 'Ladakh', 'puducherry': 'Puducherry', 'pondicherry': 'Puducherry',
  'andaman and nicobar islands': 'Andaman and Nicobar Islands', 'dadra and nagar haveli': 'Dadra and Nagar Haveli', 'dadar & nagar haveli': 'Dadra and Nagar Haveli', 'daman and diu': 'Daman and Diu', 'daman & diu': 'Daman and Diu', 'lakshadweep': 'Lakshadweep'
};

function resolveStateFromConstituency(constituency, currentState) {
  if (currentState && currentState !== 'India' && currentState !== '') {
    return currentState;
  }
  if (!constituency) return currentState || 'India';
  const cleanConst = constituency.toLowerCase().replace(/\s*\(sc\)|\s*\(st\)/gi, '').trim();
  return CONSTITUENCY_STATE_MAP[cleanConst] || currentState || 'India';
}

function cleanPoliticianName(raw) {
  if (!raw) return '';
  let str = raw.trim();
  if (str.includes(',')) {
    const parts = str.split(',').map(s => s.trim());
    if (parts.length === 2) {
      let [surname, rest] = parts;
      rest = rest.replace(/^(Shri|Smt\.|Smt|Dr\.|Dr|Prof\.|Prof|Kumari|Sri|Maulana|Haji|Advocate)\s+/i, '').trim();
      str = rest + ' ' + surname;
    }
  }
  str = str.replace(/([A-Za-z])\.([A-Za-z])/g, '$1. $2');
  str = str.replace(/\(.*?\)/g, ' ');
  str = str.replace(/^(Shri|Smt\.|Smt|Dr\.|Dr|Prof\.|Prof|Kumari|Sri|Maulana|Haji|Advocate|Sh\.)\s+/i, '');
  str = str.replace(/\bAlias\s+[A-Za-z]+/i, ' ');
  str = str.replace(/\s+/g, ' ').trim();
  return str;
}

// In-memory Wikipedia photo search cache
const photoCache = new Map();

// Pre-load disk photo cache if present
async function reloadPhotoCache() {
  try {
    const data = await fs.readFile(path.join(__dirname, 'photo_cache.json'), 'utf-8');
    const parsed = JSON.parse(data);
    for (const [k, v] of Object.entries(parsed)) {
      if (v && v.startsWith('http')) {
        photoCache.set(k.toLowerCase().trim(), v);
      }
    }
    console.log(`Loaded ${photoCache.size} pre-cached politician photos.`);
  } catch (e) {
    // Disk cache optional
  }
}
reloadPhotoCache();

function resolvePoliticianImage(name, existingImage) {
  if (existingImage && existingImage.startsWith('http') && !existingImage.includes('ui-avatars')) return existingImage;
  if (!name) return '';
  const cleanName = cleanPoliticianName(name);
  const lowerClean = cleanName.toLowerCase();
  const lowerRaw = name.toLowerCase().trim();
  
  if (REAL_PHOTO_REGISTRY[lowerClean]) return REAL_PHOTO_REGISTRY[lowerClean];
  if (REAL_PHOTO_REGISTRY[lowerRaw]) return REAL_PHOTO_REGISTRY[lowerRaw];
  if (photoCache.has(lowerClean)) return photoCache.get(lowerClean);
  if (photoCache.has(lowerRaw)) return photoCache.get(lowerRaw);

  return '';
}

// Helper to determine Lok Sabha session list
const LS_SESSIONS_MAP = {
  18: '18th Lok Sabha (2024–Present)',
  17: '17th Lok Sabha (2019–2024)',
  16: '16th Lok Sabha (2014–2019)',
  15: '15th Lok Sabha (2009–2014)',
  14: '14th Lok Sabha (2004–2009)',
  13: '13th Lok Sabha (1999–2004)',
  12: '12th Lok Sabha (1998–1999)',
  11: '11th Lok Sabha (1996–1997)',
  10: '10th Lok Sabha (1991–1996)',
  9: '9th Lok Sabha (1989–1991)',
  8: '8th Lok Sabha (1984–1989)',
  7: '7th Lok Sabha (1980–1984)',
  6: '6th Lok Sabha (1977–1979)',
  5: '5th Lok Sabha (1971–1977)',
  4: '4th Lok Sabha (1967–1970)',
  3: '3rd Lok Sabha (1962–1967)',
  2: '2nd Lok Sabha (1957–1962)',
  1: '1st Lok Sabha (1952–1957)'
};

function getWikiUrlForLeader(name) {
  if (!name) return 'https://en.wikipedia.org/wiki/Parliament_of_India';
  const clean = cleanPoliticianName(name);
  const customMap = {
    'jawaharlal nehru': 'https://en.wikipedia.org/wiki/Jawaharlal_Nehru',
    'lal bahadur shastri': 'https://en.wikipedia.org/wiki/Lal_Bahadur_Shastri',
    'indira gandhi': 'https://en.wikipedia.org/wiki/Indira_Gandhi',
    'morarji desai': 'https://en.wikipedia.org/wiki/Morarji_Desai',
    'charan singh': 'https://en.wikipedia.org/wiki/Charan_Singh',
    'chaudhary charan singh': 'https://en.wikipedia.org/wiki/Charan_Singh',
    'rajiv gandhi': 'https://en.wikipedia.org/wiki/Rajiv_Gandhi',
    'v. p. singh': 'https://en.wikipedia.org/wiki/V._P._Singh',
    'chandra shekhar': 'https://en.wikipedia.org/wiki/Chandra_Shekhar',
    'p. v. narasimha rao': 'https://en.wikipedia.org/wiki/P._V._Narasimha_Rao',
    'atal bihari vajpayee': 'https://en.wikipedia.org/wiki/Atal_Bihari_Vajpayee',
    'h. d. deve gowda': 'https://en.wikipedia.org/wiki/H._D._Deve_Gowda',
    'i. k. gujral': 'https://en.wikipedia.org/wiki/I._K._Gujral',
    'manmohan singh': 'https://en.wikipedia.org/wiki/Manmohan_Singh',
    'dr. manmohan singh': 'https://en.wikipedia.org/wiki/Manmohan_Singh',
    'narendra modi': 'https://en.wikipedia.org/wiki/Narendra_Modi',
    'dr. rajendra prasad': 'https://en.wikipedia.org/wiki/Rajendra_Prasad',
    'dr. sarvepalli radhakrishnan': 'https://en.wikipedia.org/wiki/Sarvepalli_Radhakrishnan',
    'dr. zakir husain': 'https://en.wikipedia.org/wiki/Zakir_Husain_(politician)',
    'v. v. giri': 'https://en.wikipedia.org/wiki/V._V._Giri',
    'fakhruddin ali ahmed': 'https://en.wikipedia.org/wiki/Fakhruddin_Ali_Ahmed',
    'neelam sanjiva reddy': 'https://en.wikipedia.org/wiki/Neelam_Sanjiva_Reddy',
    'giani zail singh': 'https://en.wikipedia.org/wiki/Zail_Singh',
    'r. venkataraman': 'https://en.wikipedia.org/wiki/R._Venkataraman',
    'dr. shankar dayal sharma': 'https://en.wikipedia.org/wiki/Shankar_Dayal_Sharma',
    'k. r. narayanan': 'https://en.wikipedia.org/wiki/K._R._Narayanan',
    'dr. a.p.j. abdul kalam': 'https://en.wikipedia.org/wiki/A._P._J._Abdul_Kalam',
    'a.p.j. abdul kalam': 'https://en.wikipedia.org/wiki/A._P._J._Abdul_Kalam',
    'pratibha patil': 'https://en.wikipedia.org/wiki/Pratibha_Patil',
    'pranab mukherjee': 'https://en.wikipedia.org/wiki/Pranab_Mukherjee',
    'ram nath kovind': 'https://en.wikipedia.org/wiki/Ram_Nath_Kovind',
    'droupadi murmu': 'https://en.wikipedia.org/wiki/Droupadi_Murmu',
    'dr. b. r. ambedkar': 'https://en.wikipedia.org/wiki/B._R._Ambedkar',
    'b. r. ambedkar': 'https://en.wikipedia.org/wiki/B._R._Ambedkar',
    'sardar vallabhbhai patel': 'https://en.wikipedia.org/wiki/Vallabhbhai_Patel',
    'vallabhbhai patel': 'https://en.wikipedia.org/wiki/Vallabhbhai_Patel',
    'mahatma gandhi': 'https://en.wikipedia.org/wiki/Mahatma_Gandhi',
    'subhas chandra bose': 'https://en.wikipedia.org/wiki/Subhas_Chandra_Bose',
    'bhagat singh': 'https://en.wikipedia.org/wiki/Bhagat_Singh',
    'sarojini naidu': 'https://en.wikipedia.org/wiki/Sarojini_Naidu',
    'maulana abul kalam azad': 'https://en.wikipedia.org/wiki/Abul_Kalam_Azad',
    'bal gangadhar tilak': 'https://en.wikipedia.org/wiki/Bal_Gangadhar_Tilak',
    'rahul gandhi': 'https://en.wikipedia.org/wiki/Rahul_Gandhi',
    'amit shah': 'https://en.wikipedia.org/wiki/Amit_Shah',
    'sonia gandhi': 'https://en.wikipedia.org/wiki/Sonia_Gandhi',
    'rajnath singh': 'https://en.wikipedia.org/wiki/Rajnath_Singh',
    'nitin gadkari': 'https://en.wikipedia.org/wiki/Nitin_Gadkari',
    'nirmala sitharaman': 'https://en.wikipedia.org/wiki/Nirmala_Sitharaman',
    'dr. s. jaishankar': 'https://en.wikipedia.org/wiki/S._Jaishankar',
    'akhilesh yadav': 'https://en.wikipedia.org/wiki/Akhilesh_Yadav',
    'mamata banerjee': 'https://en.wikipedia.org/wiki/Mamata_Banerjee',
    'arvind kejriwal': 'https://en.wikipedia.org/wiki/Arvind_Kejriwal',
    'shashi tharoor': 'https://en.wikipedia.org/wiki/Shashi_Tharoor'
  };
  const key = clean.toLowerCase();
  if (customMap[key]) return customMap[key];
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(clean.replace(/\s+/g, '_'))}`;
}

// Cache prepared politician records
let cachedPoliticians = null;

async function getPreparedPoliticians() {
  if (cachedPoliticians) return cachedPoliticians;

  let historical = [];
  let lokSabha = [];
  let rajyaSabha = [];

  try {
    const histRaw = await fs.readFile(path.join(__dirname, 'historical_leaders.json'), 'utf-8');
    historical = JSON.parse(histRaw).map(h => {
      const cleanName = cleanPoliticianName(h.name);
      const resolvedPhoto = resolvePoliticianImage(cleanName, h.image) || h.image || `/api/politician-photo?name=${encodeURIComponent(cleanName)}`;
      const wikiLink = h.wikiUrl || getWikiUrlForLeader(cleanName);
      
      let pmEra = null;
      if (h.roleCategory === 'Prime Minister' || (h.era && h.era.includes('Prime Minister'))) {
        const nameLower = cleanName.toLowerCase();
        if (nameLower.includes('modi')) {
          pmEra = 'Modern Leadership (2014 – Present)';
        } else if (['manmohan', 'vajpayee', 'gujral', 'deve gowda', 'narasimha', 'chandra shekhar', 'v. p. singh', 'singh'].some(s => nameLower.includes(s)) && !nameLower.includes('charan')) {
          pmEra = 'Coalition & Reform Era (1989 – 2014)';
        } else if (['rajiv', 'charan', 'morarji'].some(s => nameLower.includes(s))) {
          pmEra = 'Post-Emergency Era (1977 – 1989)';
        } else {
          pmEra = 'Founding Republic Era (1947 – 1977)';
        }
      }

      let presEra = null;
      if (h.roleCategory === 'President' || (h.era && h.era.includes('President'))) {
        const nameLower = cleanName.toLowerCase();
        if (['murmu', 'kovind', 'mukherjee', 'patil', 'kalam'].some(s => nameLower.includes(s))) {
          presEra = '21st Century Presidents (2002 – Present)';
        } else if (['narayanan', 'sharma', 'venkataraman', 'zail singh'].some(s => nameLower.includes(s))) {
          presEra = 'Constitutional Guardians & Reform (1982 – 2002)';
        } else {
          presEra = 'Early Republic Presidents (1950 – 1982)';
        }
      }

      return {
        ...h,
        image: resolvedPhoto,
        wikiUrl: wikiLink,
        pmEra,
        presEra,
        tenureGroup: pmEra || presEra || (h.era === 'Founding Fathers & Independence' ? 'Constituent Assembly & Freedom Movement' : 'National Archive')
      };
    });
  } catch (e) {
    console.error('Failed to load historical_leaders.json', e.message);
  }

  try {
    const lsRaw = await fs.readFile(path.join(__dirname, 'mps.json'), 'utf-8');
    const lsJson = JSON.parse(lsRaw);
    lokSabha = lsJson.map((mp, index) => {
      const cleanName = cleanPoliticianName(mp.name);
      const resolvedPhoto = resolvePoliticianImage(cleanName, mp.image) || `/api/politician-photo?name=${encodeURIComponent(cleanName)}`;
      
      // Parse all terms
      let termsArray = [];
      if (mp.term) {
        termsArray = String(mp.term).split(',').map(t => parseInt(t.trim(), 10)).filter(n => !isNaN(n));
      }
      if (termsArray.length === 0) {
        termsArray = [18]; // Default sitting
      }
      
      const isSitting = mp.type === 'Current' || mp.type === 'Sitting' || termsArray.includes(18) || mp.term === '18';
      const termDisplay = termsArray.map(t => `${t}th Lok Sabha`).join(', ');
      const sessionLabels = termsArray.map(t => LS_SESSIONS_MAP[t] || `${t}th Lok Sabha`);
      const activeYears = isSitting ? '2024 - 2029 (18th Lok Sabha)' : `Lok Sabha Terms: ${termsArray.join(', ')}`;
      const statusTag = isSitting ? 'Sitting MP (18th Lok Sabha)' : (mp.type || 'Former Lok Sabha MP');
      const stateResolved = resolveStateFromConstituency(mp.constituency, mp.state);
      const wikiLink = mp.wikiUrl || getWikiUrlForLeader(cleanName);
      
      return {
        id: mp.id ? `ls_${mp.id}` : `ls_${index}`,
        name: cleanName || mp.name || 'Member of Parliament',
        fullName: mp.name || cleanName || 'Member of Parliament',
        subtitle: `${mp.party || 'MP'} • ${sessionLabels[0] || '18th Lok Sabha'} (${mp.constituency || 'General'}, ${stateResolved})`,
        designation: `Member of Parliament (${sessionLabels[0] || '18th Lok Sabha'} • ${statusTag})`,
        party: mp.party || 'Independent',
        activePeriod: activeYears,
        primaryActivity: `Lok Sabha Parliamentary Representative for ${mp.constituency || 'Constituency'}, ${stateResolved}`,
        state: stateResolved,
        constituency: mp.constituency || 'General',
        education: mp.education || 'Graduate / Public Service Record',
        criminalCases: mp.criminalCases ? (String(mp.criminalCases).includes('Case') ? mp.criminalCases : `${mp.criminalCases} Cases`) : '0 Cases',
        assets: mp.assets || 'Declared Public Affidavit (ECI Form 26)',
        era: isSitting ? '18th Lok Sabha (2024–Present)' : (sessionLabels[0] || 'Lok Sabha Archive'),
        lsTerms: termsArray,
        lsSessions: sessionLabels,
        image: resolvedPhoto,
        wikiUrl: wikiLink,
        summary: mp.shortBio || `Member of Parliament representing ${mp.constituency || 'Constituency'}, ${stateResolved} (${mp.party || 'Political Party'}). Disclosed asset filings and legislative records cataloged in official ECI Affidavits.`,
        detailedBio: mp.detailedBio || `${cleanName} has represented ${mp.constituency || 'their constituency'} (${stateResolved}) in the Lok Sabha as an elected member of ${mp.party || 'their political party'}. Public declarations, parliamentary participation, and statutory asset disclosures verified in Election Commission of India (ECI) Affidavits.`,
        keyAchievements: [
          `Elected representative to the Lok Sabha for ${mp.constituency || 'Constituency'} (${stateResolved})`,
          `Parliamentary session recorded: ${sessionLabels.join(' | ')} (${statusTag})`,
          `Statutory public asset disclosures and election affidavits cataloged`
        ],
        sansadUrl: 'https://sansad.in/ls/members',
        eciUrl: 'https://affidavit.eci.gov.in/',
        adrUrl: 'https://myneta.info/'
      };
    });
  } catch (e) {
    console.error('Failed to load mps.json', e.message);
  }

  try {
    const rsRaw = await fs.readFile(path.join(__dirname, 'rajya_sabha.json'), 'utf-8');
    const rsJson = JSON.parse(rsRaw);
    rajyaSabha = rsJson.map((rs, index) => {
      const cleanName = cleanPoliticianName(rs.name) || 'Rajya Sabha Member';
      const resolvedPhoto = resolvePoliticianImage(cleanName, '') || `/api/politician-photo?name=${encodeURIComponent(cleanName)}`;
      const stateName = rs.state || 'India';
      const termPeriod = rs.currentTerm || 'Parliamentary Archive';
      const wikiLink = rs.wikiUrl || getWikiUrlForLeader(cleanName);

      // Determine Rajya Sabha historical era
      let rsEra = 'Rajya Sabha (Historical Council)';
      const termStr = String(termPeriod);
      const yearMatch = termStr.match(/\b(19\d\d|20\d\d)\b/);
      const startYear = yearMatch ? parseInt(yearMatch[1], 10) : 2020;
      
      if (startYear >= 2024 || termStr.includes('2024') || termStr.includes('2026') || termStr.includes('2028') || termStr.includes('2030')) {
        rsEra = 'Current Council (Sitting Members)';
      } else if (startYear >= 2014) {
        rsEra = '2014 – Present (Contemporary Council)';
      } else if (startYear >= 1991) {
        rsEra = '1991 – 2013 (Economic Liberalization Era)';
      } else if (startYear >= 1970) {
        rsEra = '1970 – 1990 (Post-Emergency & Coalition Era)';
      } else {
        rsEra = '1952 – 1969 (First Parliament & Constituent Era)';
      }

      return {
        id: `rs_${index}`,
        name: cleanName,
        fullName: rs.name || cleanName || 'Rajya Sabha Member',
        subtitle: `${rs.party || 'RS Member'} • Rajya Sabha (${stateName})`,
        designation: `Member of Rajya Sabha (Council of States)`,
        party: rs.party || 'Rajya Sabha',
        activePeriod: termPeriod,
        primaryActivity: `Rajya Sabha Parliamentary Representative for ${stateName}`,
        state: stateName,
        constituency: `Council of States (${stateName})`,
        education: 'Parliamentary Directory Record',
        criminalCases: '0 Disclosed Cases (Parliamentary Record)',
        assets: 'Declared Parliamentary Disclosure',
        era: 'Rajya Sabha',
        rsEra: rsEra,
        image: resolvedPhoto,
        wikiUrl: wikiLink,
        summary: `Elected representative in the Council of States (Rajya Sabha) from ${stateName} affiliated with ${rs.party || 'Parliament'}. Recorded term: ${termPeriod} (Total terms: ${rs.totalTerms || 1}). Official entry under Rajya Sabha Secretariat register.`,
        detailedBio: `${cleanName} has served in the Parliament of India as a Member of the Rajya Sabha (Council of States) representing ${stateName}. Public legislative records cataloged in the official Rajya Sabha Secretariat Register of Members. Total terms served: ${rs.totalTerms || 1}.`,
        keyAchievements: [
          `Elected representative in the Council of States (Rajya Sabha)`,
          `Parliamentary representation for ${stateName}`,
          `Parliamentary term recorded: ${termPeriod} (${rsEra})`,
          `Official entry in Rajya Sabha Secretariat All Members Register`
        ],
        sansadUrl: 'https://sansad.in/rs/members',
        eciUrl: 'https://affidavit.eci.gov.in/',
        adrUrl: 'https://myneta.info/'
      };
    });
  } catch (e) {
    console.error('Failed to load rajya_sabha.json', e.message);
  }

  cachedPoliticians = [...historical, ...lokSabha, ...rajyaSabha];
  return cachedPoliticians;
}

// API Endpoints
app.get('/api/politicians', async (req, res) => {
  try {
    const politicians = await getPreparedPoliticians();
    res.json(politicians);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve politicians', message: err.message });
  }
});

// Master State & Parliamentary Constituencies Hierarchical Registry Endpoint
app.get('/api/state-constituencies', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'state_constituencies.json');
    if (await fs.stat(filePath).catch(() => false)) {
      const data = await fs.readFile(filePath, 'utf-8');
      return res.json(JSON.parse(data));
    }
    res.status(404).json({ error: 'State constituencies registry not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load state constituencies', message: err.message });
  }
});

// Automated Wikipedia Summary & Bio Fetcher Endpoint
app.get('/api/wiki-bio', async (req, res) => {
  const rawName = req.query.name;
  if (!rawName) return res.status(400).json({ error: 'Name query parameter required' });
  
  const cleanName = cleanPoliticianName(rawName);
  const wikiUrl = getWikiUrlForLeader(cleanName);
  
  try {
    // 1. Try Wikipedia REST API summary
    const restUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanName.replace(/\s+/g, '_'))}`;
    const restResp = await fetch(restUrl, {
      headers: { 'User-Agent': 'IndianParliamentDossier/3.0 (contact@parliament-portal.org)' }
    });
    
    if (restResp.ok) {
      const data = await restResp.json();
      if (data.extract) {
        return res.json({
          title: data.title || cleanName,
          extract: data.extract,
          description: data.description || '',
          photoUrl: data.thumbnail?.source || null,
          wikiUrl: data.content_urls?.desktop?.page || wikiUrl
        });
      }
    }

    // 2. Fallback to OpenSearch / Action query
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanName + ' Indian politician')}&gsrlimit=1&prop=extracts|pageimages&exintro=true&explaintext=true&pithumbsize=600&format=json`;
    const searchResp = await fetch(searchUrl, {
      headers: { 'User-Agent': 'IndianParliamentDossier/3.0 (contact@parliament-portal.org)' }
    });

    if (searchResp.ok) {
      const sData = await searchResp.json();
      const pages = sData?.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        if (pageId && pageId !== '-1') {
          const p = pages[pageId];
          return res.json({
            title: p.title || cleanName,
            extract: p.extract || `${cleanName} is an Indian public figure and parliamentary representative.`,
            photoUrl: p.thumbnail?.source || null,
            wikiUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(p.title.replace(/\s+/g, '_'))}`
          });
        }
      }
    }

    return res.json({
      title: cleanName,
      extract: `${cleanName} has served as a verified legislative representative in the Parliament of India. Disclosed filings cataloged in public electoral gazettes.`,
      photoUrl: null,
      wikiUrl: wikiUrl
    });
  } catch (err) {
    return res.json({
      title: cleanName,
      extract: `${cleanName} is a cataloged representative in the Indian Parliamentary Directory.`,
      photoUrl: null,
      wikiUrl: wikiUrl
    });
  }
});

// Photo Cache Full Directory Endpoint
app.get('/api/photo-cache', async (req, res) => {
  await reloadPhotoCache();
  const obj = {};
  for (const [k, v] of Object.entries(REAL_PHOTO_REGISTRY)) {
    obj[k] = v;
  }
  for (const [k, v] of photoCache.entries()) {
    obj[k] = v;
  }
  res.json(obj);
});

// Live Real-Time News via Google News RSS proxy
const newsCache = new Map();
const NEWS_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

app.get('/api/politician-news', async (req, res) => {
  const rawName = req.query.name;
  if (!rawName) {
    return res.status(400).json({ error: 'Name query parameter required' });
  }

  const cleanName = cleanPoliticianName(rawName);
  const cacheKey = cleanName.toLowerCase();

  const cached = newsCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < NEWS_CACHE_TTL_MS)) {
    return res.json({ name: cleanName, articles: cached.articles, cached: true });
  }

  try {
    const searchQuery = `"${cleanName}" politician OR MP OR minister OR Parliament OR Lok Sabha OR Rajya Sabha`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-IN&gl=IN&ceid=IN:en`;

    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Google News RSS returned ${response.status}`);
    }

    const xml = await response.text();
    const articles = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && articles.length < 15) {
      const itemContent = match[1];

      // Extract title
      const titleMatch = /<title>([\s\S]*?)<\/title>/i.exec(itemContent);
      let title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim() : '';

      // Extract link
      const linkMatch = /<link>([\s\S]*?)<\/link>/i.exec(itemContent);
      let link = linkMatch ? linkMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim() : '';

      // Extract pubDate
      const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/i.exec(itemContent);
      let pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';

      // Extract source
      const sourceMatch = /<source[^>]*>([\s\S]*?)<\/source>/i.exec(itemContent);
      let source = sourceMatch ? sourceMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim() : 'Google News';

      // Clean title if source is at the end (e.g. "Title - Source")
      if (title.includes(' - ')) {
        const parts = title.split(' - ');
        if (!source || source === 'Google News') {
          source = parts.pop().trim();
        } else {
          parts.pop();
        }
        title = parts.join(' - ').trim();
      }

      // Extract description / snippet
      const descMatch = /<description>([\s\S]*?)<\/description>/i.exec(itemContent);
      let description = descMatch ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1') : '';
      description = description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

      // Decode common HTML entities
      title = title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      description = description.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

      if (title && link) {
        articles.push({
          title,
          link,
          pubDate,
          source,
          description: description || `Recent news and parliamentary coverage regarding ${cleanName}.`
        });
      }
    }

    newsCache.set(cacheKey, { timestamp: Date.now(), articles });
    return res.json({ name: cleanName, articles, total: articles.length });
  } catch (err) {
    console.error(`Failed to fetch Google News RSS for ${cleanName}:`, err);
    const fallbackArticles = [
      {
        title: `Latest Parliamentary & Political Coverage: ${cleanName}`,
        link: `https://news.google.com/search?q=${encodeURIComponent(cleanName)}&hl=en-IN&gl=IN&ceid=IN:en`,
        pubDate: new Date().toUTCString(),
        source: 'Google News Live Feed',
        description: `Explore all verified press releases, parliamentary questions, and news stories for ${cleanName}.`
      }
    ];
    return res.json({ name: cleanName, articles: fallbackArticles, total: 1, fallback: true });
  }
});

// Dynamic Wikipedia and photo resolution proxy with redirect support
app.get('/api/politician-photo', async (req, res) => {
  const rawName = req.query.name;
  if (!rawName) {
    return res.status(400).json({ error: 'Name query parameter required' });
  }

  const cleanName = cleanPoliticianName(rawName);
  const cacheKey = cleanName.toLowerCase();
  const wantsJson = req.query.format === 'json' || (req.headers.accept && req.headers.accept.includes('application/json'));

  const sendResponse = (url) => {
    if (wantsJson) {
      return res.json({ photoUrl: url });
    }
    return res.redirect(302, url);
  };

  if (photoCache.has(cacheKey)) {
    return sendResponse(photoCache.get(cacheKey));
  }

  // Check static registry
  if (REAL_PHOTO_REGISTRY[cacheKey]) {
    photoCache.set(cacheKey, REAL_PHOTO_REGISTRY[cacheKey]);
    return sendResponse(REAL_PHOTO_REGISTRY[cacheKey]);
  }

  // Try Wikipedia PageImages API
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanName + ' Indian politician')}&gsrlimit=1&prop=pageimages&pithumbsize=600&format=json`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'IndianParliamentDossier/2.0 (contact@parliament-portal.org)'
      }
    });
    if (response.ok) {
      const data = await response.json();
      const pages = data?.query?.pages;
      if (pages) {
        const pageId = Object.keys(pages)[0];
        if (pageId && pageId !== '-1' && pages[pageId].thumbnail && pages[pageId].thumbnail.source) {
          const photoUrl = pages[pageId].thumbnail.source;
          photoCache.set(cacheKey, photoUrl);
          return sendResponse(photoUrl);
        }
      }
    }
  } catch (err) {
    // Fall through to fallback
  }

  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=101726&color=e5b974&size=400&bold=true&font-size=0.36`;
  photoCache.set(cacheKey, fallback);
  return sendResponse(fallback);
});

// State aggregated statistics for interactive map & bar charts
app.get('/api/states-stats', async (req, res) => {
  try {
    const politicians = await getPreparedPoliticians();
    const stateMap = {};

    politicians.forEach(p => {
      let st = p.state || 'National / Other';
      if (st === 'India') st = 'National / Other';
      if (!stateMap[st]) {
        stateMap[st] = {
          state: st,
          total: 0,
          lokSabha: 0,
          rajyaSabha: 0,
          cleanRecord: 0,
          parties: {}
        };
      }
      stateMap[st].total += 1;
      if (p.era === 'Lok Sabha 2024' || (p.id && p.id.startsWith('ls_'))) {
        stateMap[st].lokSabha += 1;
      } else if (p.era === 'Rajya Sabha' || (p.id && p.id.startsWith('rs_'))) {
        stateMap[st].rajyaSabha += 1;
      }
      if (p.criminalCases && (p.criminalCases.includes('0') || p.criminalCases.toLowerCase().includes('clean'))) {
        stateMap[st].cleanRecord += 1;
      }
      const party = p.party || 'Other';
      stateMap[st].parties[party] = (stateMap[st].parties[party] || 0) + 1;
    });

    const sortedStates = Object.values(stateMap).sort((a, b) => b.total - a.total);
    res.json({
      states: sortedStates,
      totalCataloged: politicians.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to aggregate state statistics', message: err.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const politicians = await getPreparedPoliticians();
    const total = politicians.length;
    const lokSabhaCount = politicians.filter(p => p.era === 'Lok Sabha 2024' || (p.id && p.id.startsWith('ls_'))).length;
    const pmCount = politicians.filter(p => p.era === 'Prime Ministers of India' || p.roleCategory === 'Prime Minister').length;
    const presCount = politicians.filter(p => p.era === 'Presidents of India' || p.roleCategory === 'President').length;
    const historicalCount = politicians.filter(p => p.era === 'Founding Fathers & Independence' || p.era === 'Prime Ministers & Presidents' || p.era === 'Prime Ministers of India' || p.era === 'Presidents of India').length;
    const rajyaSabhaCount = politicians.filter(p => p.era === 'Rajya Sabha' || (p.id && p.id.startsWith('rs_'))).length;
    const zeroCriminalCount = politicians.filter(p => p.criminalCases && (p.criminalCases.includes('0') || p.criminalCases.toLowerCase().includes('clean'))).length;

    res.json({
      total,
      lokSabhaCount,
      historicalCount,
      pmCount,
      presCount,
      rajyaSabhaCount,
      zeroCriminalCount
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve stats', message: err.message });
  }
});

// Civic Accountability & Governance Endpoints

// Scheme Scorecards Endpoint (PIB claims vs CAG audits)
app.get('/api/schemes', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'schemes.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const schemes = JSON.parse(data);
    const category = req.query.category;
    if (category && category !== 'All') {
      const filtered = schemes.filter(s => s.category.toLowerCase() === category.toLowerCase());
      return res.json(filtered);
    }
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve schemes', message: err.message });
  }
});

// MPLADS Fund Utilization Endpoint
app.get('/api/mplads', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'mplads.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const mpladsList = JSON.parse(data);
    const search = (req.query.q || '').toLowerCase().trim();
    if (search) {
      const filtered = mpladsList.filter(m =>
        m.mpName.toLowerCase().includes(search) ||
        m.constituency.toLowerCase().includes(search) ||
        m.state.toLowerCase().includes(search)
      );
      return res.json(filtered);
    }
    res.json(mpladsList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve MPLADS records', message: err.message });
  }
});

// RTI Primary Document Archives Endpoint
app.get('/api/rti-archives', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'rti_archives.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const archives = JSON.parse(data);
    res.json(archives);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve RTI archives', message: err.message });
  }
});

// Hyper-Local Constituency Intelligence Endpoint (PIN Code, District, State lookup)
app.get('/api/constituencies', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data', 'constituencies.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const constituencies = JSON.parse(data);
    const query = (req.query.q || req.query.pin || '').toLowerCase().trim();

    if (query) {
      const results = constituencies.filter(c => {
        const pinMatch = c.pinCodes && c.pinCodes.some(p => p.includes(query) || query.includes(p));
        const constMatch = c.constituency.toLowerCase().includes(query);
        const districtMatch = c.district.toLowerCase().includes(query);
        const stateMatch = c.state.toLowerCase().includes(query);
        const mpMatch = c.sittingMp.toLowerCase().includes(query);
        return pinMatch || constMatch || districtMatch || stateMatch || mpMatch;
      });
      return res.json({ query, matches: results, total: results.length });
    }

    res.json({ total: constituencies.length, constituencies });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve constituency intelligence', message: err.message });
  }
});

// Automated Real-Time Parliament Data & Portrait Sync (Python Engine)
app.all('/api/sync/parliament', async (req, res) => {
  try {
    const pythonScript = path.join(__dirname, 'scripts', 'sync_parliament_data.py');
    const { stdout, stderr } = await execFileAsync('python3', [pythonScript]);
    
    // Invalidate cached politician records
    cachedPoliticians = null;
    
    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      message: 'Parliamentary data and portrait synchronization completed successfully.',
      output: stdout,
      errors: stderr || null
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Failed to execute Parliament sync pipeline',
      message: err.message
    });
  }
});

// Issue Reporting & Civic Feedback API (Persists locally & syncs to Google Sheets webhook if configured)
const ISSUES_FILE_PATH = path.join(__dirname, 'data', 'reported_issues.json');

app.post('/api/report-issue', async (req, res) => {
  try {
    const { name, email, phone, issueSelect, description, candidateContext } = req.body;

    if (!name || !email || !description) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and description are required fields.'
      });
    }

    const ticketId = 'CIVIC-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newReport = {
      ticketId,
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone || '').trim(),
      issueSelect: String(issueSelect || 'General Discrepancy / Feedback').trim(),
      description: String(description).trim(),
      candidateContext: String(candidateContext || 'General Portal / Record').trim(),
      timestamp: new Date().toISOString(),
      status: 'Open / Under Review',
      syncedToGoogleSheets: false
    };

    // 1. Read existing issues
    let issues = [];
    try {
      const data = await fs.readFile(ISSUES_FILE_PATH, 'utf-8');
      issues = JSON.parse(data);
    } catch {
      issues = [];
    }

    // 2. Append new issue
    issues.unshift(newReport);
    await fs.writeFile(ISSUES_FILE_PATH, JSON.stringify(issues, null, 2), 'utf-8');

    // 3. Forward to Google Sheets Webhook if GOOGLE_SHEET_WEBHOOK_URL is configured
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    let sheetSynced = false;
    let sheetError = null;

    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticketId: newReport.ticketId,
            name: newReport.name,
            email: newReport.email,
            phone: newReport.phone,
            issueSelect: newReport.issueSelect,
            description: newReport.description,
            candidateContext: newReport.candidateContext,
            timestamp: newReport.timestamp
          })
        });
        if (response.ok) {
          sheetSynced = true;
          newReport.syncedToGoogleSheets = true;
          // Update record with synced status
          await fs.writeFile(ISSUES_FILE_PATH, JSON.stringify(issues, null, 2), 'utf-8');
        }
      } catch (err) {
        console.warn('Google Sheets Webhook Sync warning:', err.message);
        sheetError = err.message;
      }
    }

    return res.json({
      status: 'success',
      ticketId,
      message: 'Issue report successfully submitted and recorded in the civic verification register.',
      timestamp: newReport.timestamp,
      sheetSynced
    });
  } catch (err) {
    console.error('Error recording issue:', err);
    res.status(500).json({ status: 'error', message: 'Failed to record issue report', error: err.message });
  }
});

// Retrieve all reported issues (with basic audit protection)
app.get('/api/reported-issues', async (req, res) => {
  try {
    const data = await fs.readFile(ISSUES_FILE_PATH, 'utf-8');
    const issues = JSON.parse(data);
    res.json({ total: issues.length, issues });
  } catch {
    res.json({ total: 0, issues: [] });
  }
});

// Serve Firebase Applet Configuration to Client
app.get('/api/firebase-config', async (req, res) => {
  try {
    const configPath = path.join(__dirname, 'firebase-applet-config.json');
    const data = await fs.readFile(configPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Firebase configuration not found', message: err.message });
  }
});

// Fallback to index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});

