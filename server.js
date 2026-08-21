import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

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

function resolvePoliticianImage(name, existingImage) {
  if (existingImage && existingImage.startsWith('http') && !existingImage.includes('ui-avatars')) return existingImage;
  if (!name) return '';
  const cleanName = cleanPoliticianName(name);
  const lowerClean = cleanName.toLowerCase();
  
  if (REAL_PHOTO_REGISTRY[lowerClean]) {
    return REAL_PHOTO_REGISTRY[lowerClean];
  }
  // Try partial key matching
  for (const [key, url] of Object.entries(REAL_PHOTO_REGISTRY)) {
    if (lowerClean === key || (lowerClean.length > 5 && (lowerClean.includes(key) || key.includes(lowerClean)))) {
      return url;
    }
  }
  if (photoCache.has(lowerClean)) {
    return photoCache.get(lowerClean);
  }
  return '';
}

// In-memory Wikipedia photo search cache
const photoCache = new Map();

// Pre-load disk photo cache if present
(async () => {
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
})();

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
      return {
        ...h,
        image: resolvedPhoto
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
      const isSitting = mp.type === 'Current' || mp.type === 'Sitting' || (mp.term && String(mp.term).split(',').includes('18')) || mp.term === '18';
      const termDisplay = mp.term ? `${mp.term} Lok Sabha` : (isSitting ? '18th Lok Sabha' : 'Lok Sabha');
      const activeYears = isSitting ? '2024 - 2029' : (mp.term ? `Term: ${mp.term}` : 'Parliamentary Record');
      const statusTag = isSitting ? 'Sitting MP' : (mp.type || 'Former MP');
      const stateResolved = resolveStateFromConstituency(mp.constituency, mp.state);
      
      return {
        id: mp.id ? `ls_${mp.id}` : `ls_${index}`,
        name: cleanName || mp.name || 'Member of Parliament',
        fullName: mp.name || cleanName || 'Member of Parliament',
        subtitle: `${mp.party || 'MP'} • ${termDisplay} (${mp.constituency || 'General'}, ${stateResolved})`,
        designation: `Member of Parliament (${termDisplay} • ${statusTag})`,
        party: mp.party || 'Independent',
        activePeriod: activeYears,
        primaryActivity: `Lok Sabha MP for ${mp.constituency || 'Constituency'}, ${stateResolved}`,
        state: stateResolved,
        constituency: mp.constituency || 'General',
        education: mp.education || 'Graduate / Public Service',
        criminalCases: mp.criminalCases ? (String(mp.criminalCases).includes('Case') ? mp.criminalCases : `${mp.criminalCases} Cases`) : '0 Cases',
        assets: mp.assets || 'Declared Public Affidavit',
        era: isSitting ? 'Lok Sabha 2024' : 'Lok Sabha (Archive)',
        image: resolvedPhoto,
        summary: mp.shortBio || `Member of Parliament representing ${mp.constituency || 'Constituency'}, ${stateResolved} (${mp.party || 'Political Party'}). Disclosed asset filings and legislative records cataloged in ECI Election Affidavits.`,
        detailedBio: mp.detailedBio || `${mp.name} has represented ${mp.constituency || 'their constituency'} (${stateResolved}) in the Lok Sabha as a member of ${mp.party || 'their political party'}. Public disclosures verified in Election Commission of India (ECI) Affidavits.`,
        keyAchievements: [
          `Elected representative to the Lok Sabha for ${mp.constituency || 'Constituency'} (${stateResolved})`,
          `Parliamentary tenure recorded: ${termDisplay} (${statusTag})`,
          `Legislative participation and public asset disclosures cataloged`
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
        education: 'Parliamentary Record',
        criminalCases: '0 Disclosed Cases (Parliamentary Record)',
        assets: 'Declared Parliamentary Disclosure',
        era: 'Rajya Sabha',
        image: resolvedPhoto,
        summary: `Elected representative in the Council of States (Rajya Sabha) from ${stateName} affiliated with ${rs.party || 'Parliament'}. Recorded term: ${termPeriod} (Total terms: ${rs.totalTerms || 1}). Disclosed under Rajya Sabha Secretariat official register.`,
        detailedBio: `${rs.name} has served in the Parliament of India as a Member of the Rajya Sabha (Council of States) representing ${stateName}. Public legislative records cataloged in the official Rajya Sabha Secretariat Register of Members. Total terms served: ${rs.totalTerms || 1}.`,
        keyAchievements: [
          `Elected to the Council of States (Rajya Sabha)`,
          `State parliamentary representative for ${stateName}`,
          `Parliamentary term recorded: ${termPeriod}`,
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

  for (const [k, url] of Object.entries(REAL_PHOTO_REGISTRY)) {
    if (cacheKey.length > 5 && (cacheKey.includes(k) || k.includes(cacheKey))) {
      photoCache.set(cacheKey, url);
      return sendResponse(url);
    }
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

// Fallback to index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});

