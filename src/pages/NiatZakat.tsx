
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import panahIcon from '@/assets/icons/Panah.png';
import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';

const NiatZakat = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pattern-bg">
      <Header />
      <div className="page-container py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <img src={panahIcon} alt="Kembali" className="h-5 w-5" />
        </button>
        <h2 className="text-3xl font-bold mb-8 dark:text-white capitalize tracking-tight">Panduan Lengkap Zakat</h2>

        <Tabs defaultValue="niat" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto gap-1 rounded-lg bg-muted p-1 text-muted-foreground">
            <TabsTrigger value="sejarah" className="text-sm font-medium">Sejarah</TabsTrigger>
            <TabsTrigger value="dalil" className="text-sm font-medium">Dalil</TabsTrigger>
            <TabsTrigger value="niat" className="text-sm font-medium">Niat</TabsTrigger>
          </TabsList>

          <TabsContent value="sejarah">
            <div className="grid gap-4">
              <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-2xl font-bold tracking-tight">Sejarah Zakat</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="fitrah" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 lg:w-auto gap-1 rounded-lg bg-muted/50 p-1 text-muted-foreground mb-6">
                      <TabsTrigger value="fitrah" className="text-sm font-medium">Zakat Fitrah</TabsTrigger>
                      <TabsTrigger value="mal" className="text-sm font-medium">Zakat Māl</TabsTrigger>
                      <TabsTrigger value="penghasilan" className="text-sm font-medium">Zakat Penghasilan</TabsTrigger>
                    </TabsList>

                    <TabsContent value="fitrah">
                      <div className="mb-6">
                        <h3 className="text-2xl font-semibold mb-4 text-primary tracking-tight">Sejarah Zakat Fitrah</h3>
                        <div className="space-y-6">
                          <p className="text-right text-justify">Zakat fitrah memiliki sejarah yang mulia sejak masa Nabi Muhammad SAW. Diwajibkan pada tahun kedua Hijriah, bersamaan dengan kewajiban puasa Ramadhan, zakat fitrah menjadi simbol penyucian diri dan kepedulian sosial dalam Islam.</p>
                          <p className="text-right text-justify">Pada masa Nabi SAW, beliau menetapkan kadar zakat fitrah sebesar satu sha' (sekitar 2,5 kg) dari makanan pokok seperti kurma, gandum, atau kismis. Kisah inspiratif dari masa ini adalah bagaimana Nabi SAW sendiri selalu menjadi teladan dalam membayar zakat fitrah lebih awal, mendorong para sahabat untuk segera menunaikannya sebelum shalat Idul Fitri.</p>
                          <p className="text-right text-justify">Di masa Khulafaur Rasyidin, sistem pengumpulan zakat fitrah semakin terorganisir. Khalifah Umar bin Khattab RA bahkan mengirim petugas khusus ke berbagai wilayah untuk mengumpulkan dan mendistribusikan zakat fitrah, memastikan tidak ada muslim yang kelaparan saat Idul Fitri.</p>
                          <p className="text-right text-justify">Seiring perkembangan zaman, para ulama seperti Abu Hanifah membolehkan pembayaran zakat fitrah dengan nilai uang yang setara. Ijtihad ini membuka jalan bagi fleksibilitas dalam pembayaran zakat fitrah, memudahkan umat Islam di berbagai kondisi dan wilayah.</p>
                          <p className="text-right text-justify">Di era modern, teknologi digital telah mengubah cara pembayaran dan distribusi zakat fitrah. Lembaga-lembaga zakat menggunakan platform digital untuk memudahkan muzakki membayar dan memastikan distribusi yang tepat sasaran. Kisah inspiratif kontemporer datang dari berbagai program zakat fitrah yang berhasil membantu jutaan keluarga kurang mampu merayakan Idul Fitri dengan layak.</p>
                          <p className="text-right text-justify">Dalam sejarahnya, zakat fitrah telah memainkan peran penting dalam membangun solidaritas sosial. Di masa pandemi COVID-19, misalnya, banyak lembaga zakat yang mengoptimalkan distribusi zakat fitrah untuk membantu keluarga terdampak, menunjukkan relevansi dan fleksibilitas sistem zakat dalam menghadapi tantangan modern.</p>
                          <p className="text-right text-justify">Perkembangan pengelolaan zakat fitrah juga mencerminkan evolusi pemahaman fikih. Para ulama kontemporer telah mengembangkan berbagai inovasi dalam penghitungan dan distribusi zakat fitrah, sambil tetap mempertahankan esensi dan tujuan dasarnya sebagai instrumen penyucian diri dan pemberdayaan sosial.</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="mal">
                      <div className="mb-6">
                        <h3 className="text-2xl font-semibold mb-4 text-primary tracking-tight">Sejarah Zakat Māl</h3>
                        <div className="space-y-6">
                          <p className="text-right text-justify">Zakat māl memiliki sejarah yang mengakar jauh sebelum masa Islam. Praktik memberikan sebagian harta kepada yang membutuhkan telah ada dalam tradisi para nabi terdahulu, namun Islam memberikan sistem yang lebih terstruktur dan komprehensif.</p>
                          <p className="text-right text-justify">Pada periode Makkah, konsep zakat māl diperkenalkan secara bertahap melalui ayat-ayat yang mendorong kedermawanan. Setelah hijrah ke Madinah, pada tahun kedua Hijriah, zakat māl diwajibkan dengan ketentuan yang lebih spesifik mengenai jenis harta, nisab, dan penerimanya.</p>
                          <p className="text-right text-justify">Masa keemasan pengelolaan zakat terjadi pada era Khalifah Umar bin Abdul Aziz, di mana sistem administrasi zakat yang sistematis berhasil mengentaskan kemiskinan. Pada masanya, bahkan sulit ditemukan orang yang berhak menerima zakat karena kesejahteraan masyarakat yang merata.</p>
                          <p className="text-right text-justify">Peristiwa bersejarah terjadi pada masa Khalifah Abu Bakar, ketika beliau dengan tegas memerangi kelompok yang menolak membayar zakat setelah wafatnya Rasulullah SAW. Hal ini menjadi bukti betapa fundamentalnya posisi zakat dalam sistem sosial-ekonomi Islam.</p>
                          <p className="text-right text-justify">Di masa Dinasti Umayyah, sistem pengelolaan zakat māl dikembangkan lebih lanjut dengan pembentukan Diwan al-Zakat, departemen khusus yang menangani administrasi zakat. Inovasi ini mencakup pencatatan sistematis muzakki dan mustahik, serta pengembangan metode perhitungan zakat untuk berbagai jenis harta.</p>
                          <p className="text-right text-justify">Pada masa Dinasti Abbasiyah, pengelolaan zakat māl mencapai tingkat sofistikasi yang tinggi. Para ulama seperti Abu Yusuf dan Abu Ubaid menulis karya-karya penting tentang administrasi zakat, yang menjadi rujukan hingga saat ini. Mereka mengembangkan metodologi penghitungan zakat untuk berbagai jenis kekayaan baru yang muncul seiring perkembangan ekonomi.</p>
                          <p className="text-right text-justify">Di era modern, konsep zakat māl telah beradaptasi dengan berbagai bentuk kekayaan kontemporer. Ulama kontemporer telah mengembangkan fatwa-fatwa tentang zakat saham, obligasi, properti investasi, dan aset digital. Lembaga-lembaga zakat modern juga telah mengadopsi teknologi blockchain dan sistem digital untuk meningkatkan transparansi dan efisiensi pengelolaan zakat.</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="penghasilan">
                      <div className="mb-6">
                        <h3 className="text-2xl font-semibold mb-4 text-primary tracking-tight">Sejarah Zakat Penghasilan</h3>
                        <div className="space-y-6">
                          <p className="text-right text-justify">Zakat penghasilan atau zakat profesi merupakan bentuk ijtihad ulama kontemporer dalam merespon perkembangan sistem ekonomi modern. Konsep ini mulai dibahas secara serius pada pertengahan abad ke-20, seiring dengan munculnya profesi-profesi baru dan sistem penggajian modern.</p>
                          <p className="text-right text-justify">Yusuf al-Qaradawi, dalam kitabnya Fiqh az-Zakah (1973), menjadi salah satu ulama pertama yang membahas secara komprehensif tentang zakat penghasilan. Beliau menganalogikan penghasilan dengan hasil pertanian, karena keduanya merupakan harta yang diperoleh secara berkala.</p>
                          <p className="text-right text-justify">Pada tahun 2003, Majelis Ulama Indonesia (MUI) mengeluarkan fatwa tentang zakat penghasilan, memperkuat legitimasi dan memberikan panduan praktis bagi masyarakat Muslim Indonesia. Penetapan ini didasarkan pada qiyas (analogi) dengan zakat pertanian untuk aspek regularitas penghasilan, dan zakat emas untuk perhitungan nisab.</p>
                          <p className="text-right text-justify">Di era digital, pengelolaan zakat penghasilan semakin dipermudah dengan hadirnya platform-platform pembayaran zakat online dan sistem autodebet, mencerminkan adaptasi syariat Islam terhadap perkembangan teknologi.</p>
                          <p className="text-right text-justify">Sebelum konsep zakat penghasilan dirumuskan secara formal, beberapa ulama klasik seperti Ibnu Mas'ud dan Mu'awiyah telah mempraktikkan pemotongan zakat dari gaji para pejabat dan tentara. Praktik ini menjadi preseden historis yang memperkuat argumentasi zakat penghasilan.</p>
                          <p className="text-right text-justify">Perkembangan signifikan terjadi pada tahun 1984 ketika Muktamar Zakat Internasional di Kuwait membahas secara khusus tentang zakat profesi. Forum ini menghasilkan rekomendasi tentang mekanisme perhitungan dan pembayaran zakat penghasilan yang kemudian diadopsi oleh berbagai negara Muslim.</p>
                          <p className="text-right text-justify">Di Indonesia, implementasi zakat penghasilan mendapat momentum baru dengan UU No. 23 Tahun 2011 tentang Pengelolaan Zakat. Regulasi ini memberikan landasan hukum bagi institusi dan perusahaan untuk memfasilitasi pembayaran zakat penghasilan karyawan melalui pemotongan gaji.</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Ijab Kabul Zakat Penghasilan</h4>
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-semibold mb-2">Ijab (Ucapan Pemberi Zakat)</h5>
                              <p className="text-right text-justify text-xl font-arabic">أَعْطَيْتُكَ هَذِهِ الزَّكَاةَ عَنْ كَسْبِي</p>
                              <p className="text-right text-justify italic">A'thaituka hadhihi az-zakata 'an kasbi</p>
                              <p className="text-right text-justify">"Saya berikan zakat ini dari penghasilan saya"</p>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold mb-2">Kabul (Ucapan Penerima Zakat)</h5>
                              <p className="text-right text-justify text-xl font-arabic">قَبِلْتُ زَكَاةَ كَسْبِكَ وَأَجْزَأَتْكَ</p>
                              <p className="text-right text-justify italic">Qabiltu zakata kasbika wa ajza'atka</p>
                              <p className="text-right text-justify">"Saya terima zakat penghasilanmu, semoga diterima (oleh Allah SWT)"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dalil">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dalil-dalil Zakat</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="fitrah" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 lg:w-auto gap-1 rounded-lg bg-muted/50 p-1 text-muted-foreground mb-6">
                      <TabsTrigger value="fitrah" className="text-sm font-medium">Zakat Fitrah</TabsTrigger>
                      <TabsTrigger value="mal" className="text-sm font-medium">Zakat Māl</TabsTrigger>
                      <TabsTrigger value="penghasilan" className="text-sm font-medium">Zakat Penghasilan</TabsTrigger>
                    </TabsList>

                    <TabsContent value="fitrah">
                      <div className="mb-6">
                        <h3 className="text-2xl font-semibold mb-4 text-primary tracking-tight">Dalil Zakat Fitrah</h3>
                        <div className="space-y-6">
                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Dalil Al-Qur'an</h4>
                          <p className="text-right text-justify">Allah SWT berfirman dalam Al-Qur'an Surat Al-A'la ayat 14-15:</p>
                          <p className="text-right text-justify mb-4">"قَدْ أَفْلَحَ مَن تَزَكَّىٰ ﴿١٤﴾ وَذَكَرَ اسْمَ رَبِّهِ فَصَلَّىٰ ﴿١٥﴾"</p>
                          <p className="text-right text-justify mb-4">"Sungguh beruntung orang yang menyucikan diri (dengan beriman), dan dia ingat nama Tuhannya, lalu dia shalat." (QS. Al-A'la: 14-15)</p>
                          
                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Dalil Hadits</h4>
                          <p className="text-right text-justify">Dari Ibnu Umar RA, bahwa Rasulullah SAW bersabda:</p>
                          <p className="text-right text-justify mb-4">"فَرَضَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ زَكَاةَ الْفِطْرِ مِنْ رَمَضَانَ صَاعًا مِنْ تَمْرٍ أَوْ صَاعًا مِنْ شَعِيرٍ عَلَى كُلِّ حُرٍّ أَوْ عَبْدٍ ذَكَرٍ أَوْ أُنْثَى مِنَ الْمُسْلِمِينَ"</p>
                          <p className="text-right text-justify">"Rasulullah SAW mewajibkan zakat fitrah (yang dikeluarkan) di bulan Ramadhan sebanyak satu sha' kurma atau satu sha' gandum atas setiap orang yang merdeka maupun hamba sahaya, laki-laki maupun perempuan dari kaum muslimin." (HR. Bukhari dan Muslim)</p>
                          
                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Besaran Zakat Fitrah</h4>
                          <p className="text-right text-justify">1 sha' = 2,5 kg hingga 3 kg beras atau makanan pokok setempat. Dapat juga dibayarkan dalam bentuk uang senilai beras tersebut.</p>
                          
                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Waktu Pembayaran</h4>
                          <p className="text-right text-justify">- Waktu yang diperbolehkan: Sejak awal Ramadhan
                          - Waktu yang diutamakan: 1-2 hari sebelum Idul Fitri
                          - Waktu yang wajib: Sebelum shalat Idul Fitri
                          - Waktu yang makruh: Setelah shalat Idul Fitri hingga tenggelamnya matahari
                          - Waktu yang haram: Setelah tenggelamnya matahari pada hari raya Idul Fitri</p>
                          
                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Syarat Wajib Zakat Fitrah</h4>
                          <p className="text-right text-justify">1. Beragama Islam
                          2. Hidup pada saat terbenamnya matahari di akhir bulan Ramadhan
                          3. Memiliki kelebihan makanan untuk diri sendiri dan tanggungannya pada malam dan hari raya Idul Fitri
                          4. Lahir sebelum terbenamnya matahari di akhir Ramadhan</p>
                          
                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Penerima Zakat Fitrah</h4>
                          <p className="text-right text-justify">1. Fakir: Orang yang tidak memiliki harta dan pekerjaan
                          2. Miskin: Orang yang penghasilannya tidak mencukupi kebutuhan sehari-hari
                          3. Amil: Panitia pengelola zakat
                          4. Muallaf: Orang yang baru masuk Islam
                          5. Riqab: Memerdekakan budak
                          6. Gharimin: Orang yang memiliki hutang untuk kebutuhan halal
                          7. Fi Sabilillah: Orang yang berjuang di jalan Allah
                          8. Ibnu Sabil: Musafir yang kehabisan bekal</p>
                          
                          <p className="text-right text-justify">Waktu pembayaran zakat fitrah dijelaskan dalam hadits dari Ibnu Abbas RA, bahwa Rasulullah SAW mewajibkan zakat fitrah sebagai penyucian bagi orang yang berpuasa dari perbuatan sia-sia dan perkataan kotor, serta sebagai makanan bagi orang-orang miskin. Barangsiapa menunaikannya sebelum shalat (Idul Fitri), maka itu adalah zakat yang diterima, dan barangsiapa menunaikannya setelah shalat, maka itu hanyalah sedekah biasa.</p>


                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="mal">
                      <div className="mb-6">
                        <h3 className="text-2xl font-semibold mb-4 text-primary tracking-tight">Dalil Zakat Māl</h3>
                        <div className="space-y-6">
                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Dalil Al-Qur'an</h4>
                          <p className="text-right text-justify">Allah SWT berfirman dalam Al-Qur'an Surat At-Taubah ayat 103:</p>
                          <p className="text-right text-justify mb-4">"خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا وَصَلِّ عَلَيْهِمْ ۖ إِنَّ صَلَاتَكَ سَكَنٌ لَّهُمْ ۗ وَاللَّهُ سَمِيعٌ عَلِيمٌ"</p>
                          <p className="text-right text-justify mb-4">"Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka dan mendoalah untuk mereka. Sesungguhnya doa kamu itu (menjadi) ketenteraman jiwa bagi mereka. Dan Allah Maha Mendengar lagi Maha Mengetahui." (QS. At-Taubah: 103)</p>

                          <p className="text-right text-justify">Allah SWT juga berfirman dalam Surat Al-Baqarah ayat 43:</p>
                          <p className="text-right text-justify mb-4">"وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ"</p>
                          <p className="text-right text-justify mb-4">"Dan dirikanlah shalat, tunaikanlah zakat dan ruku'lah beserta orang-orang yang ruku'." (QS. Al-Baqarah: 43)</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Dalil Hadits</h4>
                          <p className="text-right text-justify">Dalam hadits yang diriwayatkan oleh Bukhari dan Muslim, Rasulullah SAW bersabda:</p>
                          <p className="text-right text-justify mb-4">"بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَالْحَجِّ، وَصَوْمِ رَمَضَانَ"</p>
                          <p className="text-right text-justify">"Islam dibangun di atas lima perkara: bersaksi bahwa tiada Tuhan selain Allah dan Muhammad adalah utusan Allah, mendirikan shalat, menunaikan zakat, melaksanakan haji, dan berpuasa di bulan Ramadhan." (HR. Bukhari dan Muslim)</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Jenis Harta yang Wajib Dizakati</h4>
                          <p className="text-right text-justify">1. Emas dan Perak
                          - Nisab emas: 85 gram
                          - Nisab perak: 595 gram
                          - Kadar zakat: 2,5%</p>
                          
                          <p className="text-right text-justify">2. Hewan Ternak
                          - Unta: Nisab 5 ekor
                          - Sapi: Nisab 30 ekor
                          - Kambing: Nisab 40 ekor</p>


                          
                          <p className="text-right text-justify">3. Hasil Pertanian
                          - Nisab: 653 kg
                          - Kadar zakat: 10% (tadah hujan) atau 5% (irigasi)</p>
                          
                          <p className="text-right text-justify">4. Perdagangan
                          - Nisab: Senilai 85 gram emas
                          - Kadar zakat: 2,5%</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Syarat Wajib Zakat Māl</h4>
                          <p className="text-right text-justify">1. Islam
                          2. Merdeka
                          3. Milik penuh
                          4. Berkembang
                          5. Mencapai nisab
                          6. Lebih dari kebutuhan pokok
                          7. Bebas dari hutang
                          8. Mencapai haul (1 tahun) kecuali pertanian</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Waktu Pembayaran</h4>
                          <p className="text-right text-justify">- Zakat pertanian: Saat panen
                          - Zakat hewan ternak, emas, perak, dan perdagangan: Setelah mencapai haul (1 tahun)
                          - Zakat rikaz (harta temuan): Saat ditemukan</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="penghasilan">
                      <div className="mb-6">
                        <h3 className="text-2xl font-semibold mb-4 text-primary tracking-tight">Dalil Zakat Penghasilan</h3>
                        <div className="space-y-6">
                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Dalil Al-Qur'an</h4>
                          <p className="text-right text-justify">Allah SWT berfirman dalam Al-Qur'an Surat Al-Baqarah ayat 267:</p>
                          <p className="text-right text-justify mb-4">"يَا أَيُّهَا الَّذِينَ آمَنُوا أَنفِقُوا مِن طَيِّبَاتِ مَا كَسَبْتُمْ وَمِمَّا أَخْرَجْنَا لَكُم مِّنَ الْأَرْضِ"</p>
                          <p className="text-right text-justify mb-4">"Hai orang-orang yang beriman, nafkahkanlah (di jalan Allah) sebagian dari hasil usahamu yang baik-baik dan sebagian dari apa yang Kami keluarkan dari bumi untuk kamu." (QS. Al-Baqarah: 267)</p>

                          <p className="text-right text-justify">Allah SWT juga berfirman dalam Surat Adz-Dzariyat ayat 19:</p>
                          <p className="text-right text-justify mb-4">"وَفِي أَمْوَالِهِمْ حَقٌّ لِّلسَّائِلِ وَالْمَحْرُومِ"</p>
                          <p className="text-right text-justify mb-4">"Dan pada harta-harta mereka ada hak untuk orang miskin yang meminta dan orang miskin yang tidak mendapat bagian." (QS. Adz-Dzariyat: 19)</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Dalil Hadits</h4>
                          <p className="text-right text-justify">Dari Abu Hurairah RA, Rasulullah SAW bersabda:</p>
                          <p className="text-right text-justify mb-4">"إِذَا أَدَّيْتَ زَكَاةَ مَالِكَ فَقَدْ قَضَيْتَ مَا عَلَيْكَ"</p>
                          <p className="text-right text-justify mb-4">"Apabila engkau telah menunaikan zakat hartamu, maka engkau telah menunaikan kewajibanmu." (HR. Ibnu Khuzaimah)</p>

                          <p className="text-right text-justify">Para ulama kontemporer menggunakan dalil-dalil ini sebagai landasan wajibnya zakat penghasilan, karena mencakup semua penghasilan yang diperoleh dari usaha yang halal. Keumuman ayat dan hadits tersebut menunjukkan bahwa setiap harta yang diperoleh dengan cara yang halal wajib dikeluarkan zakatnya ketika telah memenuhi syarat-syaratnya.</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Ketentuan Zakat Penghasilan</h4>
                          <p className="text-right text-justify">1. Nisab
                          - Setara dengan 85 gram emas
                          - Atau setara dengan 653 kg beras
                          - Dihitung dari pendapatan bersih setelah dikurangi kebutuhan pokok</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Cara Perhitungan</h4>
                          <p className="text-right text-justify">1. Model 1: Langsung saat menerima
                          - Kadar zakat: 2,5% dari penghasilan kotor
                          - Dibayarkan langsung ketika menerima gaji</p>
                          
                          <p className="text-right text-justify">2. Model 2: Setelah 1 tahun
                          - Kadar zakat: 2,5% dari total penghasilan setahun
                          - Dibayarkan setelah mencapai haul</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Syarat Wajib</h4>
                          <p className="text-right text-justify">1. Islam
                          2. Merdeka
                          3. Milik penuh
                          4. Penghasilan halal
                          5. Mencapai nisab
                          6. Lebih dari kebutuhan pokok
                          7. Bebas dari hutang</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">Waktu Pembayaran</h4>
                          <p className="text-right text-justify">- Bulanan: Setiap menerima penghasilan
                          - Tahunan: Setelah terkumpul selama satu tahun
                          - Dianjurkan: Membayar di bulan Ramadhan untuk mendapat pahala berlipat</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="niat">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Niat dan Ijab Kabul Zakat</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="fitrah" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 lg:w-auto gap-1 rounded-lg bg-muted/50 p-1 text-muted-foreground mb-6">
                      <TabsTrigger value="fitrah" className="text-sm font-medium">Zakat Fitrah</TabsTrigger>
                      <TabsTrigger value="mal" className="text-sm font-medium">Zakat Māl</TabsTrigger>
                      <TabsTrigger value="penghasilan" className="text-sm font-medium">Zakat Penghasilan</TabsTrigger>
                    </TabsList>

                    <TabsContent value="fitrah">
                      <div className="mb-6">
                        <h3 className="text-2xl font-semibold mb-4 text-primary tracking-tight">Niat Zakat Fitrah</h3>
                        <div className="space-y-6">
                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">1. Niat Zakat Fitrah untuk Diri Sendiri</h4>
                          <p className="text-right text-justify text-xl font-arabic">نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ الْفِطْرِ عَنْ نَفْسِي فَرْضًا لِلَّهِ تَعَالَى</p>
                          <p className="text-right text-justify">Dibaca: "Nawaitu an ukhrija zakaatal fithri 'an nafsii fardhan lillaahi ta'aalaa"</p>
                          <p className="text-right text-justify mb-6">Artinya: "Saya niat mengeluarkan zakat fitrah untuk diri saya sendiri fardhu karena Allah Ta'ala"</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">2. Niat Zakat Fitrah untuk Keluarga</h4>
                          <p className="text-right text-justify text-xl font-arabic">نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ الْفِطْرِ عَنْ نَفْسِي وَعَنْ مَنْ تَلْزَمُنِي نَفَقَتُهُ فَرْضًا لِلَّهِ تَعَالَى</p>
                          <p className="text-right text-justify">Dibaca: "Nawaitu an ukhrija zakaatal fithri 'an nafsi wa 'amman talzamunii nafaqotuhu fardhan lillaahi ta'aalaa"</p>
                          <p className="text-right text-justify mb-6">Artinya: "Saya niat mengeluarkan zakat fitrah untuk diriku dan orang yang wajib aku nafkahi, fardhu karena Allah Ta'ala"</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight">3. Niat Zakat Fitrah Mewakili Orang Lain</h4>
                          <p className="text-right text-justify text-xl font-arabic">نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ الْفِطْرِ عَنْ فُلاَنٍ فَرْضًا لِلَّهِ تَعَالَى</p>
                          <p className="text-right text-justify">Dibaca: "Nawaitu an ukhrija zakaatal fithri 'an (fulan) fardhan lillaahi ta'aalaa"</p>
                          <p className="text-right text-justify">Artinya: "Saya niat mengeluarkan zakat fitrah untuk (nama), fardhu karena Allah Ta'ala"</p>
                          <p className="text-right text-justify text-sm text-gray-500">Catatan: Ganti (fulan)/(nama) dengan nama orang yang diwakili</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight mt-6">Ijab Kabul Zakat Fitrah</h4>
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-semibold mb-2">Ijab (Ucapan Pemberi Zakat)</h5>
                              <p className="text-right text-justify text-xl font-arabic">أَعْطَيْتُكَ هَذِهِ الزَّكَاةَ عَنْ نَفْسِي وَعَنْ أَهْلِ بَيْتِي</p>
                              <p className="text-right text-justify italic">A'thaituka hadhihi az-zakata 'an nafsi wa 'an ahli baiti</p>
                              <p className="text-right text-justify">"Saya berikan zakat fitrah ini untuk diriku dan keluargaku"</p>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold mb-2">Kabul (Ucapan Penerima Zakat)</h5>
                              <p className="text-right text-justify text-xl font-arabic">قَبِلْتُ زَكَاتَكَ وَأَجْزَأَتْكَ</p>
                              <p className="text-right text-justify italic">Qabiltu zakataka wa ajza'atka</p>
                              <p className="text-right text-justify">"Saya terima zakatmu, semoga diterima (oleh Allah SWT)"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="mal">
                      <div className="mb-6">
                        <h3 className="text-2xl font-semibold mb-4 text-primary tracking-tight">Niat Zakat Māl</h3>
                        <div className="space-y-6">
                          <p className="text-right text-justify">Niat zakat māl dalam bahasa Arab:</p>
                          <p className="text-right text-justify text-xl font-arabic">نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ مَالِي فَرْضًا لِلَّهِ تَعَالَى</p>
                          <p className="text-right text-justify">Dibaca: "Nawaitu an ukhrija zakaata maalii fardhan lillaahi ta'aalaa"</p>
                          <p className="text-right text-justify">Artinya: "Saya niat mengeluarkan zakat harta saya fardhu karena Allah Ta'ala"</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight mt-6">Ijab Kabul Zakat Māl</h4>
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-semibold mb-2">Ijab (Ucapan Pemberi Zakat)</h5>
                              <p className="text-right text-justify text-xl font-arabic">أَعْطَيْتُكَ هَذِهِ الزَّكَاةَ عَنْ مَالِي</p>
                              <p className="text-right text-justify italic">A'thaituka hadhihi az-zakata 'an mali</p>
                              <p className="text-right text-justify">"Saya berikan zakat harta ini dari harta saya"</p>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold mb-2">Kabul (Ucapan Penerima Zakat)</h5>
                              <p className="text-right text-justify text-xl font-arabic">قَبِلْتُ زَكَاةَ مَالِكَ وَأَجْزَأَتْكَ</p>
                              <p className="text-right text-justify italic">Qabiltu zakata malika wa ajza'atka</p>
                              <p className="text-right text-justify">"Saya terima zakat hartamu, semoga diterima (oleh Allah SWT)"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="penghasilan">
                      <div className="mb-6">
                        <h3 className="text-2xl font-semibold mb-4 text-primary tracking-tight">Niat Zakat Penghasilan</h3>
                        <div className="space-y-6">
                          <p className="text-right text-justify">Niat zakat penghasilan dalam bahasa Arab:</p>
                          <p className="text-right text-justify text-xl font-arabic">نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ كَسْبِي فَرْضًا لِلَّهِ تَعَالَى</p>
                          <p className="text-right text-justify">Dibaca: "Nawaitu an ukhrija zakaata kasbii fardhan lillaahi ta'aalaa"</p>
                          <p className="text-right text-justify">Artinya: "Saya niat mengeluarkan zakat penghasilan saya fardhu karena Allah Ta'ala"</p>

                          <h4 className="text-xl font-semibold mb-2 text-primary tracking-tight mt-6">Ijab Kabul Zakat Penghasilan</h4>
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-semibold mb-2">Ijab (Ucapan Pemberi Zakat)</h5>
                              <p className="text-right text-justify text-xl font-arabic">أَعْطَيْتُكَ هَذِهِ الزَّكَاةَ عَنْ كَسْبِي</p>
                              <p className="text-right text-justify italic">A'thaituka hadhihi az-zakata 'an kasbi</p>
                              <p className="text-right text-justify">"Saya berikan zakat ini dari penghasilan saya"</p>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold mb-2">Kabul (Ucapan Penerima Zakat)</h5>
                              <p className="text-right text-justify text-xl font-arabic">قَبِلْتُ زَكَاةَ كَسْبِكَ وَأَجْزَأَتْكَ</p>
                              <p className="text-right text-justify italic">Qabiltu zakata kasbika wa ajza'atka</p>
                              <p className="text-right text-justify">"Saya terima zakat penghasilanmu, semoga diterima (oleh Allah SWT)"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NiatZakat;
