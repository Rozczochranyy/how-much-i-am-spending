import { 
  Receipt, HeartPulse, Car, ShoppingCart, Gamepad2, Plane, 
  Utensils, Shirt, Bath, Gift, Laptop, Briefcase, Coins, HelpCircle
} from 'lucide-react';

export function getCategoryIcon(category: string, className?: string) {
  const props = { className };
  switch (category.toLowerCase()) {
    case 'bills': return <Receipt {...props} />;
    case 'health': return <HeartPulse {...props} />;
    case 'car': return <Car {...props} />;
    case 'grocerry': return <ShoppingCart {...props} />;
    case 'fun': return <Gamepad2 {...props} />;
    case 'trip': return <Plane {...props} />;
    case 'restaurants': return <Utensils {...props} />;
    case 'clothes': return <Shirt {...props} />;
    case 'hygiens stuffs': return <Bath {...props} />;
    case 'gifts': return <Gift {...props} />;
    case 'eletronics': return <Laptop {...props} />;
    case 'salary': return <Briefcase {...props} />;
    case 'extra money': return <Coins {...props} />;
    default: return <HelpCircle {...props} />;
  }
}
