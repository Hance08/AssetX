// Import all the icons you plan to use
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CommuteIcon from '@mui/icons-material/Commute';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentIcon from '@mui/icons-material/Payment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// Create a mapping from icon names (strings) to the component types
const iconMap = {
  Restaurant: RestaurantIcon,
  Commute: CommuteIcon,
  SportsEsports: SportsEsportsIcon,
  ShoppingCart: ShoppingCartIcon,
  Person: PersonIcon,
  MedicalServices: MedicalServicesIcon,
  Home: HomeIcon,
  ReceiptLong: ReceiptLongIcon,
  Payment: PaymentIcon,
  HelpOutline: HelpOutlineIcon,
  AttachMoney: AttachMoneyIcon,
  Default: HelpOutlineIcon,
};

// Export a function that returns the icon component TYPE based on the name
export const getIconComponent = (iconName) => {
  return iconMap[iconName] || iconMap.Default;
}; 