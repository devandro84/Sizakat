import React from 'react';
import { DonorRecord } from '../utils/database';
import { formatRiceWeight } from '../utils/zakatFormatting';

interface ReceiptTemplateProps {
  donor: DonorRecord;
  mosqueName: string;
  address: string;
  headerText: string;
  footerText: string;
  fontSize: number;
  marginLeft: number;
  marginRight: number;
  lineSpacing: number;
  characterSpacing: number;
  className?: string;
}

// Template Default - Tampilan klasik dengan header dan footer sederhana
export const DefaultTemplate: React.FC<ReceiptTemplateProps> = ({
  donor,
  mosqueName,
  address,
  headerText,
  footerText,
  fontSize,
  marginLeft,
  marginRight,
  lineSpacing,
}) => {
  return (
    <div
      className="receipt-preview p-4 border rounded-lg bg-white"
      style={{
        fontSize: `${fontSize}px`,
        marginLeft: `${marginLeft}mm`,
        marginRight: `${marginRight}mm`,
        lineHeight: lineSpacing,
      }}
    >
      <div className="text-center font-bold mb-2">{headerText}</div>
      <div className="text-center mb-4">
        <div>{mosqueName}</div>
        <div className="text-sm">{address}</div>
      </div>
      <div className="border-t border-b py-2 mb-4">
        <div>Nama: {donor.headOfFamily}</div>
        <div>RT: {donor.rtNumber}</div>
        <div>Jumlah Jiwa: {donor.familyCount}</div>
      </div>
      <div className="mb-4">
        <div className="font-bold mb-2">Rincian Pembayaran:</div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Jumlah Jiwa</span>
            <span>{donor.familyCount} orang</span>
          </div>
          {donor.paymentMethod === 'cash' ? (
            <>
              <div className="flex justify-between">
                <span>Zakat Fitrah per Jiwa</span>
                <span>Rp {(donor.cashAmount / donor.familyCount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Zakat Fitrah</span>
                <span>Rp {donor.cashAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Infaq Baznas per Jiwa</span>
                <span>Rp {(donor.infaqAmount / donor.familyCount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Infaq Baznas</span>
                <span>Rp {donor.infaqAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Infaq Masjid per Jiwa</span>
                <span>Rp {(donor.mosqueInfaqAmount / donor.familyCount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Infaq Masjid</span>
                <span>Rp {donor.mosqueInfaqAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total Pembayaran</span>
                <span>Rp {(donor.cashAmount + donor.infaqAmount + donor.mosqueInfaqAmount).toLocaleString()}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span>Zakat Fitrah per Jiwa</span>
                <span>{formatRiceWeight(donor.riceAmount / donor.familyCount)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Zakat Fitrah</span>
                <span>{formatRiceWeight(donor.riceAmount)}</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="text-center text-sm mt-4">{footerText}</div>
    </div>
  );
};

// Template Modern - Desain minimalis dengan aksen warna
export const ModernTemplate: React.FC<ReceiptTemplateProps> = (props) => {
  return (
    <div
      className="receipt-preview p-6 rounded-xl bg-gradient-to-b from-blue-50 to-white"
      style={{
        fontSize: `${props.fontSize}px`,
        marginLeft: `${props.marginLeft}mm`,
        marginRight: `${props.marginRight}mm`,
        lineHeight: props.lineSpacing,
      }}
    >
      <div className="text-blue-600 text-center font-bold text-xl mb-3">
        {props.headerText}
      </div>
      <div className="text-center mb-6">
        <div className="font-semibold text-gray-800">{props.mosqueName}</div>
        <div className="text-gray-600 text-sm">{props.address}</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">Nama</div>
          <div className="font-medium">{props.donor.headOfFamily}</div>
          <div className="text-gray-600">RT</div>
          <div className="font-medium">{props.donor.rtNumber}</div>
          <div className="text-gray-600">Jumlah Jiwa</div>
          <div className="font-medium">{props.donor.familyCount}</div>
        </div>
      </div>
      <div className="border-t border-blue-100 pt-4 mb-6">
        <div className="font-medium mb-3">Rincian Pembayaran:</div>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Jumlah Jiwa</span>
            <span>{props.donor.familyCount} orang</span>
          </div>
          {props.donor.paymentMethod === 'cash' ? (
            <>
              <div className="flex justify-between text-gray-600">
                <span>Zakat Fitrah per Jiwa</span>
                <span>Rp {(props.donor.cashAmount / props.donor.familyCount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-blue-600 font-medium">
                <span>Total Zakat Fitrah</span>
                <span>Rp {props.donor.cashAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Infaq Baznas per Jiwa</span>
                <span>Rp {(props.donor.infaqAmount / props.donor.familyCount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Infaq Baznas</span>
                <span>Rp {props.donor.infaqAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Infaq Masjid per Jiwa</span>
                <span>Rp {(props.donor.mosqueInfaqAmount / props.donor.familyCount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Infaq Masjid</span>
                <span>Rp {props.donor.mosqueInfaqAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-blue-600 pt-3 border-t border-blue-100">
                <span>Total Pembayaran</span>
                <span>Rp {(props.donor.cashAmount + props.donor.infaqAmount + props.donor.mosqueInfaqAmount).toLocaleString()}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between text-gray-600">
                <span>Zakat Fitrah per Jiwa</span>
                <span>{(props.donor.riceAmount / props.donor.familyCount).toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between text-blue-600 font-medium">
                <span>Total Zakat Fitrah</span>
                <span>{props.donor.riceAmount.toFixed(1)} kg</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="text-center text-gray-600 text-sm mt-6">
        {props.footerText}
      </div>
    </div>
  );
};

// Template Classic - Desain tradisional dengan ornamen
export const ClassicTemplate: React.FC<ReceiptTemplateProps> = (props) => {
  return (
    <div
      className="receipt-preview p-6 border-4 border-double bg-[#fff9e6]"
      style={{
        fontSize: `${props.fontSize}px`,
        marginLeft: `${props.marginLeft}mm`,
        marginRight: `${props.marginRight}mm`,
        lineHeight: props.lineSpacing,
      }}
    >
      <div className="text-center mb-4">
        <div className="text-2xl font-serif font-bold mb-2">{props.headerText}</div>
        <div className="font-serif">{props.mosqueName}</div>
        <div className="text-sm">{props.address}</div>
      </div>
      <div className="border-y-2 border-dashed py-4 mb-4">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="py-1">Nama</td>
              <td>: {props.donor.headOfFamily}</td>
            </tr>
            <tr>
              <td className="py-1">RT</td>
              <td>: {props.donor.rtNumber}</td>
            </tr>
            <tr>
              <td className="py-1">Jumlah Jiwa</td>
              <td>: {props.donor.familyCount}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mb-4">
        <div className="font-serif font-bold mb-3">Rincian Pembayaran:</div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Jumlah Jiwa</span>
            <span>{props.donor.familyCount} orang</span>
          </div>
          {props.donor.paymentMethod === 'cash' ? (
            <>
              <div className="flex justify-between">
                <span>Zakat Fitrah per Jiwa</span>
                <span>Rp {(props.donor.cashAmount / props.donor.familyCount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Zakat Fitrah</span>
                <span>Rp {props.donor.cashAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Infaq Baznas per Jiwa</span>
                <span>Rp {(props.donor.infaqAmount / props.donor.familyCount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Infaq Baznas</span>
                <span>Rp {props.donor.infaqAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Infaq Masjid per Jiwa</span>
                <span>Rp {(props.donor.mosqueInfaqAmount / props.donor.familyCount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Infaq Masjid</span>
                <span>Rp {props.donor.mosqueInfaqAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-dashed">
                <span>Total Pembayaran</span>
                <span>Rp {(props.donor.cashAmount + props.donor.infaqAmount + props.donor.mosqueInfaqAmount).toLocaleString()}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span>Zakat Fitrah per Jiwa</span>
                <span>{(props.donor.riceAmount / props.donor.familyCount).toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Zakat Fitrah</span>
                <span>{props.donor.riceAmount.toFixed(1)} kg</span>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="text-center text-sm mt-6 font-serif">{props.footerText}</div>
    </div>
  );
};

// Template Minimalist - Desain simpel dan bersih
export const MinimalistTemplate: React.FC<ReceiptTemplateProps> = (props) => {
  return (
    <div
      className="receipt-preview p-6 bg-white"
      style={{
        fontSize: `${props.fontSize}px`,
        marginLeft: `${props.marginLeft}mm`,
        marginRight: `${props.marginRight}mm`,
        lineHeight: props.lineSpacing,
      }}
    >
      <div className="text-lg font-light mb-6">{props.headerText}</div>
      <div className="mb-8">
        <div className="font-medium">{props.mosqueName}</div>
        <div className="text-sm text-gray-600">{props.address}</div>
      </div>
      <div className="space-y-4 mb-8">
        <div>
          <div className="text-sm text-gray-600">Nama</div>
          <div>{props.donor.headOfFamily}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">RT</div>
          <div>{props.donor.rtNumber}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Jumlah Jiwa</div>
          <div>{props.donor.familyCount}</div>
        </div>
      </div>
      <div className="space-y-4 mb-8">
        <div className="text-sm text-gray-600 font-medium mb-2">Rincian Pembayaran</div>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-500">Jumlah Jiwa</div>
            <div>{props.donor.familyCount} orang</div>
          </div>
          {props.donor.paymentMethod === 'cash' ? (
            <>
              <div>
                <div className="text-sm text-gray-500">Zakat Fitrah per Jiwa</div>
                <div>Rp {(props.donor.cashAmount / props.donor.familyCount).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Zakat Fitrah</div>
                <div className="font-medium">Rp {props.donor.cashAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Infaq Baznas per Jiwa</div>
                <div>Rp {(props.donor.infaqAmount / props.donor.familyCount).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Infaq Baznas</div>
                <div>Rp {props.donor.infaqAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Infaq Masjid per Jiwa</div>
                <div>Rp {(props.donor.mosqueInfaqAmount / props.donor.familyCount).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Infaq Masjid</div>
                <div>Rp {props.donor.mosqueInfaqAmount.toLocaleString()}</div>
              </div>
              <div className="pt-3 border-t">
                <div className="text-sm text-gray-500">Total Pembayaran</div>
                <div className="font-bold">Rp {(props.donor.cashAmount + props.donor.infaqAmount + props.donor.mosqueInfaqAmount).toLocaleString()}</div>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="text-sm text-gray-500">Zakat Fitrah per Jiwa</div>
                <div>{(props.donor.riceAmount / props.donor.familyCount).toFixed(1)} kg</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Zakat Fitrah</div>
                <div className="font-medium">{props.donor.riceAmount.toFixed(1)} kg</div>
              </div>
            </>
          )}
        </div>
        <div className="text-sm text-gray-600 mt-4">Infaq</div>
        <div>Rp {props.donor.infaqAmount.toLocaleString()}</div>
      </div>
      <div className="text-sm text-gray-600 mt-8">{props.footerText}</div>
    </div>
  );
};