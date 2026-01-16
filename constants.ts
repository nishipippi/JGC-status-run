import { Airport } from './types';

// Defining the Big Hubs manually for classification
const BIG_HUBS = ['HND', 'NRT', 'ITM', 'KIX', 'NGO', 'CTS', 'FUK', 'OKA', 'KOJ'];

// Complete Database based on the Report
export const AIRPORTS: Record<string, Airport> = {
  // --- Hokkaido ---
  CTS: { iata: 'CTS', name: '札幌(新千歳)', lat: 42.7752, lng: 141.6923, size: 'BIG', connections: ['HND', 'NRT', 'ITM', 'KIX', 'NGO', 'FUK', 'HIJ', 'AOJ', 'HNA', 'SDJ', 'MMB', 'TKS'] },
  OKD: { iata: 'OKD', name: '札幌(丘珠)', lat: 43.1161, lng: 141.3803, size: 'SMALL', connections: ['HKD', 'KUH', 'MMB', 'RIS', 'OIR', 'SHB', 'MSJ', 'AXT'] },
  HKD: { iata: 'HKD', name: '函館', lat: 41.7700, lng: 140.8244, size: 'SMALL', connections: ['HND', 'ITM', 'OKD', 'OIR'] },
  AKJ: { iata: 'AKJ', name: '旭川', lat: 43.6708, lng: 142.4536, size: 'SMALL', connections: ['HND'] },
  KUH: { iata: 'KUH', name: '釧路', lat: 43.0408, lng: 144.1919, size: 'SMALL', connections: ['HND', 'OKD'] },
  OBO: { iata: 'OBO', name: '帯広', lat: 42.7333, lng: 143.2172, size: 'SMALL', connections: ['HND'] },
  MMB: { iata: 'MMB', name: '女満別', lat: 43.8800, lng: 144.1644, size: 'SMALL', connections: ['HND', 'CTS', 'OKD', 'ITM'] },
  SHB: { iata: 'SHB', name: '中標津', lat: 43.5775, lng: 144.9592, size: 'SMALL', connections: ['HND', 'OKD'] },
  RIS: { iata: 'RIS', name: '利尻', lat: 45.2425, lng: 141.1917, size: 'SMALL', connections: ['OKD', 'CTS'] },
  OIR: { iata: 'OIR', name: '奥尻', lat: 42.0733, lng: 139.4319, size: 'SMALL', connections: ['HKD', 'OKD'] },

  // --- Tohoku ---
  AOJ: { iata: 'AOJ', name: '青森', lat: 40.7350, lng: 140.6900, size: 'SMALL', connections: ['HND', 'ITM', 'CTS'] },
  MSJ: { iata: 'MSJ', name: '三沢', lat: 40.7033, lng: 141.3683, size: 'SMALL', connections: ['HND', 'ITM', 'OKD'] },
  AXT: { iata: 'AXT', name: '秋田', lat: 39.6156, lng: 140.2186, size: 'SMALL', connections: ['HND', 'ITM', 'OKD'] },
  HNA: { iata: 'HNA', name: '花巻', lat: 39.4286, lng: 141.1353, size: 'SMALL', connections: ['ITM', 'CTS'] },
  SDJ: { iata: 'SDJ', name: '仙台', lat: 38.1397, lng: 140.9169, size: 'SMALL', connections: ['ITM', 'CTS'] },
  GAJ: { iata: 'GAJ', name: '山形', lat: 38.4119, lng: 140.3711, size: 'SMALL', connections: ['HND', 'ITM'] },

  // --- Kanto / Chubu ---
  HND: { iata: 'HND', name: '東京(羽田)', lat: 35.5494, lng: 139.7798, size: 'BIG', connections: ['CTS', 'AKJ', 'MMB', 'KUH', 'OBO', 'HKD', 'SHB', 'AOJ', 'MSJ', 'AXT', 'GAJ', 'KMQ', 'NGO', 'ITM', 'KIX', 'SHM', 'OKJ', 'HIJ', 'UBJ', 'IZO', 'TKS', 'TAK', 'KCZ', 'MYJ', 'FUK', 'KKJ', 'OIT', 'NGS', 'KMJ', 'KMI', 'KOJ', 'ASJ', 'OKA', 'MMY', 'ISG', 'UEO'] },
  NRT: { iata: 'NRT', name: '東京(成田)', lat: 35.7720, lng: 140.3929, size: 'BIG', connections: ['CTS', 'ITM', 'KIX', 'NGO'] },
  NGO: { iata: 'NGO', name: '名古屋(中部)', lat: 34.8584, lng: 136.8048, size: 'BIG', connections: ['HND', 'NRT', 'CTS', 'OKA', 'ISG', 'MMY'] },
  KMQ: { iata: 'KMQ', name: '小松', lat: 36.3939, lng: 136.4075, size: 'SMALL', connections: ['HND', 'OKA'] },
  KIJ: { iata: 'KIJ', name: '新潟', lat: 37.9558, lng: 139.1206, size: 'SMALL', connections: ['ITM'] },
  MMJ: { iata: 'MMJ', name: '松本', lat: 36.1667, lng: 137.9231, size: 'SMALL', connections: ['ITM'] }, // August only logic handled by inclusion, user beware!

  // --- Kansai ---
  ITM: { iata: 'ITM', name: '大阪(伊丹)', lat: 34.7855, lng: 135.4382, size: 'BIG', connections: ['HND', 'NRT', 'CTS', 'HKD', 'AOJ', 'MMB', 'MSJ', 'AXT', 'HNA', 'SDJ', 'GAJ', 'KIJ', 'MMJ', 'TJH', 'MYJ', 'IZO', 'OKI', 'FUK', 'OIT', 'NGS', 'KMJ', 'KMI', 'KOJ', 'TNE', 'KUM', 'ASJ', 'TKN', 'OKA'] },
  KIX: { iata: 'KIX', name: '大阪(関西)', lat: 34.4320, lng: 135.2304, size: 'BIG', connections: ['HND', 'CTS', 'NRT', 'OKA', 'ISG', 'MMY'] },
  SHM: { iata: 'SHM', name: '南紀白浜', lat: 33.6622, lng: 135.3625, size: 'SMALL', connections: ['HND'] },
  TJH: { iata: 'TJH', name: '但馬', lat: 35.5133, lng: 134.7869, size: 'SMALL', connections: ['ITM'] },

  // --- Chugoku / Shikoku ---
  OKJ: { iata: 'OKJ', name: '岡山', lat: 34.7578, lng: 133.8553, size: 'SMALL', connections: ['HND', 'OKA'] },
  HIJ: { iata: 'HIJ', name: '広島', lat: 34.4361, lng: 132.9194, size: 'SMALL', connections: ['HND', 'CTS'] },
  UBJ: { iata: 'UBJ', name: '山口宇部', lat: 33.9300, lng: 131.2792, size: 'SMALL', connections: ['HND'] },
  IZO: { iata: 'IZO', name: '出雲', lat: 35.4136, lng: 132.8892, size: 'SMALL', connections: ['HND', 'ITM', 'FUK', 'OKI'] },
  OKI: { iata: 'OKI', name: '隠岐', lat: 36.1808, lng: 133.3242, size: 'SMALL', connections: ['ITM', 'IZO'] },
  TKS: { iata: 'TKS', name: '徳島', lat: 34.1328, lng: 134.6067, size: 'SMALL', connections: ['HND', 'FUK', 'CTS'] },
  TAK: { iata: 'TAK', name: '高松', lat: 34.2142, lng: 134.0153, size: 'SMALL', connections: ['HND'] },
  KCZ: { iata: 'KCZ', name: '高知', lat: 33.5461, lng: 133.6694, size: 'SMALL', connections: ['HND', 'FUK'] },
  MYJ: { iata: 'MYJ', name: '松山', lat: 33.8272, lng: 132.6997, size: 'SMALL', connections: ['HND', 'ITM', 'FUK'] },

  // --- Kyushu ---
  FUK: { iata: 'FUK', name: '福岡', lat: 33.5859, lng: 130.4506, size: 'BIG', connections: ['HND', 'NRT', 'ITM', 'CTS', 'OKA', 'KMI', 'TKS', 'KCZ', 'MYJ', 'IZO', 'ASJ', 'KUM'] },
  KKJ: { iata: 'KKJ', name: '北九州', lat: 33.8456, lng: 131.0350, size: 'SMALL', connections: ['HND'] },
  OIT: { iata: 'OIT', name: '大分', lat: 33.4794, lng: 131.7375, size: 'SMALL', connections: ['HND', 'ITM'] },
  NGS: { iata: 'NGS', name: '長崎', lat: 32.9169, lng: 129.9136, size: 'SMALL', connections: ['HND', 'ITM'] },
  KMJ: { iata: 'KMJ', name: '熊本', lat: 32.8372, lng: 130.8550, size: 'SMALL', connections: ['HND', 'ITM'] },
  KMI: { iata: 'KMI', name: '宮崎', lat: 31.8772, lng: 131.4489, size: 'SMALL', connections: ['HND', 'ITM', 'FUK'] },
  KOJ: { iata: 'KOJ', name: '鹿児島', lat: 31.8033, lng: 130.7192, size: 'BIG', connections: ['HND', 'ITM', 'FUK', 'TNE', 'KUM', 'KJK', 'ASJ', 'TKN', 'OKE', 'RNJ'] },

  // --- Islands (Kagoshima/Okinawa) ---
  TNE: { iata: 'TNE', name: '種子島', lat: 30.5453, lng: 130.9839, size: 'SMALL', connections: ['KOJ', 'ITM'] },
  KUM: { iata: 'KUM', name: '屋久島', lat: 30.3811, lng: 130.6586, size: 'SMALL', connections: ['KOJ', 'FUK', 'ITM'] },
  KJK: { iata: 'KJK', name: '喜界島', lat: 28.3228, lng: 129.9286, size: 'SMALL', connections: ['KOJ', 'ASJ'] },
  ASJ: { iata: 'ASJ', name: '奄美大島', lat: 28.4306, lng: 129.7125, size: 'SMALL', connections: ['HND', 'ITM', 'FUK', 'KOJ', 'KJK', 'TKN', 'RNJ', 'OKA'] },
  TKN: { iata: 'TKN', name: '徳之島', lat: 27.8361, lng: 128.8825, size: 'SMALL', connections: ['KOJ', 'ASJ', 'OKE', 'ITM'] },
  OKE: { iata: 'OKE', name: '沖永良部', lat: 27.4253, lng: 128.7006, size: 'SMALL', connections: ['KOJ', 'TKN', 'RNJ', 'OKA'] },
  RNJ: { iata: 'RNJ', name: '与論', lat: 27.0422, lng: 128.4011, size: 'SMALL', connections: ['KOJ', 'ASJ', 'OKE', 'OKA'] },

  // --- Okinawa Main & Remote ---
  OKA: { iata: 'OKA', name: '那覇', lat: 26.1958, lng: 127.6458, size: 'BIG', connections: ['HND', 'NRT', 'ITM', 'KIX', 'NGO', 'FUK', 'KMQ', 'OKJ', 'UEO', 'MMY', 'ISG', 'OGN', 'MMD', 'KTD', 'ASJ', 'OKE', 'RNJ'] },
  UEO: { iata: 'UEO', name: '久米島', lat: 26.3636, lng: 126.7131, size: 'SMALL', connections: ['OKA', 'HND'] },
  MMY: { iata: 'MMY', name: '宮古', lat: 24.7833, lng: 125.2953, size: 'SMALL', connections: ['OKA', 'HND', 'KIX', 'NGO', 'ISG', 'TRA'] },
  TRA: { iata: 'TRA', name: '多良間', lat: 24.6547, lng: 124.6725, size: 'SMALL', connections: ['MMY'] },
  ISG: { iata: 'ISG', name: '石垣', lat: 24.3964, lng: 124.2450, size: 'SMALL', connections: ['OKA', 'HND', 'KIX', 'NGO', 'MMY', 'OGN'] },
  OGN: { iata: 'OGN', name: '与那国', lat: 24.4667, lng: 122.9772, size: 'SMALL', connections: ['OKA', 'ISG'] },
  MMD: { iata: 'MMD', name: '南大東', lat: 25.8458, lng: 131.2656, size: 'SMALL', connections: ['OKA', 'KTD'] },
  KTD: { iata: 'KTD', name: '北大東', lat: 25.9431, lng: 131.3306, size: 'SMALL', connections: ['OKA', 'MMD'] },
};
