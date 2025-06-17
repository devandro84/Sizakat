import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';

const SejarahKurban = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sejarah Kurban</CardTitle>
        <CardDescription>
          Sejarah dan ketentuan ibadah kurban dalam Islam
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sejarah Kurban</h3>
            <p className="text-gray-600 dark:text-gray-300 text-justify">
              Sejarah kurban berawal dari kisah Nabi Ibrahim AS yang mendapat perintah dari Allah SWT melalui mimpi untuk menyembelih putranya, Ismail AS. Ketika Ibrahim AS dan Ismail AS dengan penuh ketaatan hendak melaksanakan perintah tersebut, Allah SWT menggantikannya dengan seekor domba dari surga. Peristiwa ini menjadi asal mula disyariatkannya ibadah kurban dalam Islam.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-justify">
              Kisah pengorbanan ini diabadikan dalam Al-Quran Surat As-Saffat ayat 102-107, yang menggambarkan dialog antara Ibrahim AS dengan Ismail AS dan bagaimana keduanya menunjukkan ketaatan yang luar biasa kepada Allah SWT.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Dalil-dalil Kurban</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Dalil Al-Quran</h4>
                <p className="text-gray-600 dark:text-gray-300 text-right mb-2 font-arabic text-xl">فَصَلِّ لِرَبِّكَ وَانْحَرْ</p>
                <p className="text-gray-600 dark:text-gray-300 italic mb-2">"Maka dirikanlah shalat karena Tuhanmu dan berkurbanlah." (QS. Al-Kautsar: 2)</p>
                
                <p className="text-gray-600 dark:text-gray-300 text-right mb-2 font-arabic text-xl">قَالَ يَا بُنَيَّ إِنِّي أَرَىٰ فِي الْمَنَامِ أَنِّي أَذْبَحُكَ فَانظُرْ مَاذَا تَرَىٰ</p>
                <p className="text-gray-600 dark:text-gray-300 italic mb-2">"Wahai anakku, sesungguhnya aku bermimpi menyembelihmu. Maka pikirkanlah bagaimana pendapatmu!" (QS. As-Saffat: 102)</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Dalil Hadits</h4>
                <p className="text-gray-600 dark:text-gray-300 text-right mb-2 font-arabic text-xl">مَنْ كَانَ لَهُ سَعَةٌ وَلَمْ يُضَحِّ فَلَا يَقْرَبَنَّ مُصَلَّانَا</p>
                <p className="text-gray-600 dark:text-gray-300 italic">"Barangsiapa yang memiliki kemampuan tetapi tidak berkurban, maka janganlah ia mendekati tempat shalat kami." (HR. Ahmad dan Ibnu Majah)</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Hukum dan Waktu Kurban</h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p className="text-justify">Kurban hukumnya sunnah muakkadah (sangat dianjurkan) bagi yang mampu. Sebagian ulama berpendapat wajib bagi yang mampu berdasarkan hadits di atas.</p>
              <p className="text-justify">Waktu penyembelihan:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Dimulai setelah shalat Idul Adha</li>
                <li>Berlangsung selama hari tasyriq (11, 12, dan 13 Dzulhijjah)</li>
                <li>Penyembelihan boleh dilakukan siang atau malam hari</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Ketentuan Hewan Kurban</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Syarat Hewan Kurban</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Cukup umur:
                    <ul className="list-disc pl-6 mt-1">
                      <li>Kambing/Domba: minimal 1 tahun</li>
                      <li>Sapi/Kerbau: minimal 2 tahun</li>
                      <li>Unta: minimal 5 tahun</li>
                    </ul>
                  </li>
                  <li>Sehat dan tidak memiliki cacat yang nyata</li>
                  <li>Tidak kurus dan dalam kondisi baik</li>
                  <li>Tidak buta, pincang, atau sakit</li>
                  <li>Tidak terpotong telinganya atau tanduknya</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-1">Ketentuan Jumlah Orang</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>1 ekor kambing/domba untuk 1 orang/keluarga</li>
                  <li>1 ekor sapi/kerbau/unta untuk 7 orang</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-1">Pembagian Daging Kurban</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>1/3 untuk yang berkurban</li>
                  <li>1/3 untuk disedekahkan kepada fakir miskin</li>
                  <li>1/3 untuk dihadiahkan kepada kerabat/tetangga</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Hikmah Kurban</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Mendekatkan diri kepada Allah SWT</li>
              <li>Menghidupkan sunnah Nabi Ibrahim AS</li>
              <li>Berbagi dengan sesama, terutama kaum dhuafa</li>
              <li>Mensyukuri nikmat Allah SWT</li>
              <li>Meningkatkan kepedulian sosial</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SejarahKurban;