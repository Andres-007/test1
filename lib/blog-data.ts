export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  date: string
  readTime: number
  image: string
  tags: string[]
}

export const blogPosts: BlogPost[] = [
  {
    id: 'mejores-asientos-avion',
    title: 'Cómo elegir los mejores asientos en un avión',
    excerpt: 'Guía completa para seleccionar el asiento perfecto según tus necesidades: ventanilla, pasillo o salida de emergencia.',
    content: `
## Introducción

Elegir el asiento correcto puede marcar la diferencia entre un vuelo cómodo y uno tedioso. Aquí te explicamos todo lo que necesitas saber.

## Asientos de ventanilla

**Ventajas:**
- Vista panorámica durante el vuelo
- Pared para apoyar la cabeza y dormir
- No te molestan otros pasajeros para pasar

**Desventajas:**
- Difícil acceso al pasillo y baño
- Menos espacio para estirar las piernas hacia el pasillo

## Asientos de pasillo

**Ventajas:**
- Fácil acceso al baño
- Más espacio para estirar las piernas
- Puedes pararte cuando quieras

**Desventajas:**
- Te interrumpen constantemente
- Sin vista exterior

## Asientos de salida de emergencia

**Ventajas:**
- Mucho más espacio para las piernas
- Ideal para personas altas

**Desventajas:**
- No puedes llevar equipaje de mano bajo el asiento
- Responsabilidad en caso de emergencia
- Generalmente tienen costo adicional

## Consejos adicionales

1. **Reserva con anticipación** - Los mejores asientos se agotan rápido
2. **Usa SeatGuru** - Consulta los mapas de asientos antes de reservar
3. **Considera el tipo de avión** - La configuración varía según el modelo
4. **Evita las últimas filas** - Menos reclinación y cerca de los baños
    `,
    category: 'Consejos de vuelo',
    author: 'María García',
    date: '2024-01-15',
    readTime: 5,
    image: '/blog/asientos.jpg',
    tags: ['asientos', 'comodidad', 'consejos']
  },
  {
    id: 'superar-miedo-volar',
    title: '10 técnicas para superar el miedo a volar',
    excerpt: 'Estrategias probadas por psicólogos y pilotos para controlar la ansiedad antes y durante el vuelo.',
    content: `
## El miedo a volar es más común de lo que crees

Aproximadamente el 25% de las personas experimentan algún nivel de ansiedad al volar. Aquí te presentamos técnicas efectivas para superarlo.

## 1. Conoce los datos

Los aviones son el medio de transporte más seguro. La probabilidad de un accidente es de 1 en 11 millones.

## 2. Técnica de respiración 4-7-8

- Inhala por 4 segundos
- Mantén por 7 segundos
- Exhala por 8 segundos

## 3. Distracción activa

- Lleva películas, música o libros
- Juegos en el teléfono o tablet
- Conversación con compañeros de viaje

## 4. Evita la cafeína y el alcohol

Ambos pueden aumentar la ansiedad. Opta por agua o jugos naturales.

## 5. Elige el asiento correcto

Si tienes miedo, el asiento sobre las alas es el más estable durante las turbulencias.

## 6. Informa a la tripulación

El personal está entrenado para ayudar a pasajeros nerviosos.

## 7. Visualización positiva

Imagina el destino y las experiencias que te esperan.

## 8. Aplicaciones de relajación

Headspace, Calm y otras apps tienen meditaciones específicas para vuelos.

## 9. Terapia de exposición gradual

Considera visitar aeropuertos o simuladores antes de tu vuelo.

## 10. Ayuda profesional

Si el miedo es severo, considera terapia cognitivo-conductual.
    `,
    category: 'Bienestar',
    author: 'Dr. Carlos López',
    date: '2024-01-10',
    readTime: 7,
    image: '/blog/miedo-volar.jpg',
    tags: ['miedo', 'ansiedad', 'bienestar', 'consejos']
  },
  {
    id: 'equipaje-mano-permitido',
    title: 'Guía definitiva del equipaje de mano: qué puedes y qué no puedes llevar',
    excerpt: 'Todo sobre las restricciones de seguridad, líquidos, electrónicos y objetos prohibidos en cabina.',
    content: `
## Reglas generales del equipaje de mano

Las aerolíneas tienen restricciones específicas sobre qué puedes llevar en cabina. Aquí te explicamos todo.

## Líquidos (Regla 3-1-1)

- **100ml máximo** por envase
- **1 bolsa transparente** de 1 litro
- **Todos los líquidos** deben caber en la bolsa

## Electrónicos permitidos

- Laptops y tablets
- Cámaras fotográficas
- Teléfonos móviles
- Baterías externas (power banks)
- E-readers

## Objetos prohibidos

- Cuchillos y objetos cortantes
- Herramientas mayores de 7cm
- Armas de cualquier tipo
- Líquidos inflamables
- Explosivos o pirotecnia

## Medicamentos

- Siempre permitidos con receta
- Líquidos médicos exentos del límite de 100ml
- Lleva documentación médica

## Alimentos

- Sólidos generalmente permitidos
- Líquidos y semilíquidos siguen la regla 3-1-1
- Revisa restricciones del país de destino

## Consejos para el control de seguridad

1. Saca laptops y líquidos antes de pasar
2. Quítate cinturón, reloj y objetos metálicos
3. Llega con tiempo suficiente
4. Organiza tu equipaje para fácil revisión
    `,
    category: 'Equipaje',
    author: 'Ana Martínez',
    date: '2024-01-05',
    readTime: 6,
    image: '/blog/equipaje-mano.jpg',
    tags: ['equipaje', 'seguridad', 'aeropuerto']
  },
  {
    id: 'jet-lag-combatir',
    title: 'Cómo combatir el jet lag: guía científica',
    excerpt: 'Métodos respaldados por la ciencia para adaptarte rápidamente a nuevos husos horarios.',
    content: `
## ¿Qué es el jet lag?

El jet lag es un trastorno temporal del sueño causado por viajar a través de múltiples zonas horarias.

## Síntomas comunes

- Fatiga extrema
- Dificultad para dormir o despertarse
- Problemas de concentración
- Molestias estomacales
- Cambios de humor

## Antes del vuelo

### 3 días antes
- Ajusta gradualmente tu horario de sueño
- Si viajas al este, duerme 1 hora antes cada día
- Si viajas al oeste, duerme 1 hora después

### El día del vuelo
- Evita alcohol y cafeína
- Mantente bien hidratado
- Come ligero

## Durante el vuelo

- Ajusta tu reloj a la hora del destino
- Duerme si es de noche en tu destino
- Mantente despierto si es de día
- Muévete y estira regularmente

## Al llegar

### Exposición a la luz
- La luz natural es tu mejor aliado
- Sal al exterior durante el día
- Evita pantallas brillantes antes de dormir

### Alimentación
- Come en los horarios locales
- Evita comidas pesadas antes de dormir
- La melatonina puede ayudar (consulta con tu médico)

### Ejercicio
- Actividad ligera durante el día
- Evita ejercicio intenso antes de dormir

## Tiempo de recuperación

Generalmente se necesita 1 día por cada zona horaria cruzada para recuperarse completamente.
    `,
    category: 'Bienestar',
    author: 'Dr. Roberto Sánchez',
    date: '2023-12-28',
    readTime: 8,
    image: '/blog/jet-lag.jpg',
    tags: ['jet lag', 'sueño', 'bienestar', 'consejos']
  },
  {
    id: 'aerolineas-evitar',
    title: 'Señales de alerta: cuándo evitar una aerolínea',
    excerpt: 'Indicadores clave para identificar aerolíneas con problemas de servicio, seguridad o finanzas.',
    content: `
## Cómo evaluar la calidad de una aerolínea

No todas las aerolíneas ofrecen el mismo nivel de servicio. Aquí te enseñamos a identificar señales de alerta.

## Señales financieras

- **Retrasos en pagos a proveedores**
- **Cancelaciones masivas de rutas**
- **Despidos frecuentes**
- **Noticias sobre problemas de liquidez**

## Problemas de seguridad

- **En listas negras de la UE o USA**
- **Incidentes recientes reportados**
- **Flota muy antigua** (aviones de más de 25 años)
- **Multas de autoridades de aviación**

## Servicio al cliente

- **Reseñas consistentemente negativas** (menos de 3 estrellas)
- **Políticas de reembolso abusivas**
- **Atención al cliente inexistente**
- **Quejas en redes sociales sin respuesta**

## Prácticas comerciales

- **Cargos ocultos excesivos**
- **Publicidad engañosa**
- **Cambios de vuelo sin aviso**
- **Overbooking frecuente**

## Cómo investigar

1. **Skytrax** - Ratings y reseñas de pasajeros
2. **AirlineRatings.com** - Calificaciones de seguridad
3. **AESA/FAA** - Listas de aerolíneas prohibidas
4. **Redes sociales** - Comentarios recientes de usuarios

## Aerolíneas con mejor reputación

Busca aerolíneas con:
- Certificación IOSA
- Rating de 4+ estrellas
- Flota moderna
- Programas de fidelización sólidos
    `,
    category: 'Consejos de vuelo',
    author: 'Pedro Fernández',
    date: '2023-12-20',
    readTime: 6,
    image: '/blog/aerolineas-evitar.jpg',
    tags: ['aerolíneas', 'seguridad', 'consejos', 'advertencias']
  },
  {
    id: 'vuelos-largos-sobrevivir',
    title: 'Cómo sobrevivir a vuelos de más de 10 horas',
    excerpt: 'Tips de viajeros frecuentes para hacer más llevaderos los vuelos transoceánicos.',
    content: `
## Preparación es la clave

Los vuelos largos pueden ser agotadores, pero con la preparación adecuada puedes llegar fresco a tu destino.

## Antes del vuelo

### Qué empacar en tu equipaje de mano
- Almohada de viaje de calidad
- Auriculares con cancelación de ruido
- Antifaz y tapones para oídos
- Calcetines cómodos
- Snacks saludables
- Botella de agua vacía (llenar después del control)
- Kit de higiene básico

### Vestimenta
- Ropa cómoda y en capas
- Zapatos fáciles de quitar
- Evita jeans ajustados

## Durante el vuelo

### Hidratación
- Bebe agua cada hora
- Evita alcohol (deshidrata)
- Limita la cafeína

### Movimiento
- Levántate cada 2-3 horas
- Ejercicios de estiramiento en el asiento
- Usa calcetines de compresión para prevenir trombosis

### Sueño
- Intenta dormir según el horario del destino
- Usa antifaz y tapones
- Evita pantallas 30 minutos antes de dormir

### Entretenimiento
- Descarga contenido offline
- Lleva libro o e-reader
- Música relajante para dormir

## Alimentación

- Come ligero antes y durante el vuelo
- Evita alimentos que produzcan gases
- Lleva snacks propios (frutas secas, barras de granola)

## Al aterrizar

- No te vayas directo a dormir si es de día
- Ducha y cambio de ropa
- Caminata corta al aire libre
    `,
    category: 'Consejos de vuelo',
    author: 'Laura Gómez',
    date: '2023-12-15',
    readTime: 7,
    image: '/blog/vuelos-largos.jpg',
    tags: ['vuelos largos', 'comodidad', 'consejos', 'viajes']
  }
]

export const blogCategories = [
  'Todos',
  'Consejos de vuelo',
  'Bienestar',
  'Equipaje',
]
