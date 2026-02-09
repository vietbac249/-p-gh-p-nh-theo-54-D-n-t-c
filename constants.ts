
import { Location, Costume } from './types';

export const LOCATIONS: Location[] = [
  // North
  { id: 'sapa', name: 'Sa Pa', region: 'North' },
  { id: 'fansipan', name: 'Đỉnh Fansipan', region: 'North' },
  { id: 'babe', name: 'Hồ Ba Bể', region: 'North' },
  { id: 'dongvan', name: 'Cao nguyên đá Đồng Văn', region: 'North' },
  { id: 'tamdao', name: 'Tam Đảo', region: 'North' },
  // Central
  { id: 'haivan', name: 'Đèo Hải Vân', region: 'Central' },
  { id: 'banahills', name: 'Bà Nà Hills', region: 'Central' },
  { id: 'sondoong', name: 'Hang Sơn Đoòng', region: 'Central' },
  { id: 'culaocham', name: 'Cù Lao Chàm', region: 'Central' },
  { id: 'vinhhy', name: 'Vịnh Vĩnh Hy', region: 'Central' },
  // South
  { id: 'phuquoc', name: 'Phú Quốc', region: 'South' },
  { id: 'condao', name: 'Côn Đảo', region: 'South' },
  { id: 'trasu', name: 'Rừng tràm Trà Sư', region: 'South' },
  { id: 'muine', name: 'Mũi Né', region: 'South' },
  { id: 'naden', name: 'Núi Bà Đen', region: 'South' },
];

export const COSTUMES: Costume[] = [
  { id: 'tay', name: 'Trang phục Tày', ethnicGroup: 'Tày' },
  { id: 'thai', name: 'Trang phục Thái', ethnicGroup: 'Thái' },
  { id: 'muong', name: 'Trang phục Mường', ethnicGroup: 'Mường' },
  { id: 'hoa', name: 'Trang phục Hoa', ethnicGroup: 'Hoa' },
  { id: 'khmer', name: 'Trang phục Khmer', ethnicGroup: 'Khmer' },
  { id: 'nung', name: 'Trang phục Nùng', ethnicGroup: 'Nùng' },
  { id: 'hmong', name: 'Trang phục H\'Mông', ethnicGroup: 'H\'Mông' },
  { id: 'dao', name: 'Trang phục Dao', ethnicGroup: 'Dao' },
];
