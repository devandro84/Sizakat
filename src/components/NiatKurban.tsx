import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';

const NiatKurban = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Niat Kurban</CardTitle>
        <CardDescription>
          Bacaan niat dan doa kurban dalam Islam
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Ketentuan dan Adab Niat Kurban</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-2">Waktu Berniat</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Niat kurban dilakukan sebelum hewan disembelih</li>
                <li>Sebaiknya niat diucapkan pada malam pertama bulan Dzulhijjah</li>
                <li>Boleh juga berniat ketika akan menyembelih hewan kurban</li>
              </ul>

              <h4 className="font-medium mb-2 mt-4">Adab Berniat</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Berniat dengan hati yang ikhlas</li>
                <li>Menghadap kiblat saat mengucapkan niat</li>
                <li>Membaca niat dengan suara yang jelas</li>
                <li>Memastikan dalam keadaan suci dari hadats besar</li>
                <li>Mengucapkan dengan bahasa Arab bagi yang mampu</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Niat Kurban untuk Diri Sendiri</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-right mb-2 font-arabic text-xl">
                نَوَيْتُ الذَّبْحَ لِلْقُرْبَانِ فَرْضًا لِلَّهِ تَعَالَى
              </p>
              <p className="text-gray-600 dark:text-gray-300 italic mb-2">
                Nawaitul dzabha lil qurbani fardlan lillahi ta'ala
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                "Saya niat menyembelih hewan kurban fardhu karena Allah Ta'ala"
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Niat Kurban untuk Keluarga</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-right mb-2 font-arabic text-xl">
                نَوَيْتُ الذَّبْحَ لِلْقُرْبَانِ عَنِّي وَعَنْ أَهْلِ بَيْتِي فَرْضًا لِلَّهِ تَعَالَى
              </p>
              <p className="text-gray-600 dark:text-gray-300 italic mb-2">
                Nawaitul dzabha lil qurbani 'anni wa'an ahli baiti fardlan lillahi ta'ala
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                "Saya niat menyembelih hewan kurban fardhu untuk saya dan keluarga saya karena Allah Ta'ala"
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Doa Menyembelih Kurban</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-right mb-2 font-arabic text-xl">
                بِسْمِ اللهِ وَاللهُ أَكْبَرُ، اَللَّهُمَّ مِنْكَ وَلَكَ، اَللَّهُمَّ تَقَبَّلْ مِنِّي
              </p>
              <p className="text-gray-600 dark:text-gray-300 italic mb-2">
                Bismillahi wallahu akbar, Allahumma minka wa laka, Allahumma taqabbal minni
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                "Dengan nama Allah, Allah Maha Besar. Ya Allah, dari-Mu dan untuk-Mu. Ya Allah, terimalah dariku"
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NiatKurban;