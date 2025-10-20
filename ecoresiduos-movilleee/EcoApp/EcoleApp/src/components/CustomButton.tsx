import * as React from 'react';
import { TouchableOpacity, Text } from 'react-native';

/**
 * Define las propiedades (props) para el componente CustomButton.
 * Se utiliza 'string | undefined' para className ya que puede ser opcional.
 */
interface CustomButtonProps {
  title: string;
  onPress: () => void;
  className?: string; // Clases adicionales de NativeWind para personalización
}

/**
 * Componente de botón reutilizable con estilo NativeWind.
 * Asegura la accesibilidad y un área de toque adecuada.
 */
// Usamos React.FunctionComponent o FC para tipar el componente
export const CustomButton: React.FC<CustomButtonProps> = ({ 
  title, 
  onPress, 
  className = '' 
}) => {
  // Clases base para el botón:
  const baseClasses = 'p-4 rounded-xl bg-lime-500 shadow-lg';

  // Clases base para el texto:
  const textClasses = 'text-white text-center font-bold text-lg';

  return (
    <TouchableOpacity
      // Combina las clases base y las clases personalizadas
      className={`${baseClasses} ${className}`}
      onPress={onPress}
      activeOpacity={0.8} // Opacidad al presionar para feedback visual
    >
      <Text className={textClasses}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};