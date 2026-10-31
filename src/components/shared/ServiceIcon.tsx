import React from 'react';
import {
  Server,
  Tv,
  Users,
  Terminal,
  Sparkles,
  ShieldCheck,
  Activity,
  MessageSquare,
  Globe,
  Database,
  Cloud,
  Layers,
  Box,
} from 'lucide-react';

interface ServiceIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, className = 'w-5 h-5', style }) => {
  switch (name?.toLowerCase()) {
    case 'server':
      return <Server className={className} style={style} />;
    case 'tv':
      return <Tv className={className} style={style} />;
    case 'users':
      return <Users className={className} style={style} />;
    case 'terminal':
      return <Terminal className={className} style={style} />;
    case 'sparkles':
      return <Sparkles className={className} style={style} />;
    case 'shieldcheck':
    case 'shield':
      return <ShieldCheck className={className} style={style} />;
    case 'activity':
      return <Activity className={className} style={style} />;
    case 'messagesquare':
    case 'message':
      return <MessageSquare className={className} style={style} />;
    case 'database':
      return <Database className={className} style={style} />;
    case 'cloud':
      return <Cloud className={className} style={style} />;
    case 'layers':
      return <Layers className={className} style={style} />;
    default:
      return <Box className={className} style={style} />;
  }
};
