# 🪙 Mint Works - Juego Multijugador Online

Versión online multijugador (web) de Mint Works — partidas en tiempo real con colocación de trabajadores, gestión de mercado y cartas de desarrollo.

## 🎮 Características

- ✅ **Multijugador en tiempo real** (2-4 jugadores)
- ✅ **Colocación de trabajadores** en diferentes ubicaciones
- ✅ **Gestión de mercado** con cartas de desarrollo
- ✅ **Sistema de recursos** (Mints y Stars)
- ✅ **Sistema de puntos de victoria**
- ✅ **Interfaz web moderna y responsive**
- ✅ **Comunicación en tiempo real** con Socket.IO

## 🚀 Instalación

### Requisitos previos
- Node.js (v14 o superior)
- npm

### Pasos de instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/AndreYuli/mint-works.git
cd mint-works
```

2. Instalar dependencias del servidor:
```bash
npm install
```

3. Instalar dependencias del cliente:
```bash
cd client
npm install
cd ..
```

## 🎯 Cómo jugar

### Iniciar el servidor en desarrollo
```bash
npm run dev
```

Este comando iniciará:
- Servidor backend en `http://localhost:3000`
- Cliente frontend en `http://localhost:5173`

### Iniciar solo el servidor (producción)
```bash
npm run build
npm start
```

El servidor servirá la aplicación en `http://localhost:3000`

## 📖 Reglas del juego

### Objetivo
Ser el primer jugador en alcanzar **7 puntos de victoria** construyendo cartas de desarrollo.

### Mecánicas

1. **Fase de Planificación**: Los jugadores toman turnos colocando trabajadores en ubicaciones disponibles.

2. **Ubicaciones disponibles**:
   - **Proveedor**: Gana 2 Mints (costo: 1 Mint)
   - **Productor**: Gana 1 Star (costo: 1 Mint)
   - **Constructor**: Construye una carta de desarrollo (costo: 2 Mints)
   - **Liderazgo**: Ser el primer jugador en la próxima ronda (costo: 1 Mint)
   - **Lotería**: Gana 1 Star o 2 Mints (costo: 1 Mint)

3. **Construcción**: Usa Mints y Stars para comprar cartas del mercado que otorgan puntos de victoria.

4. **Efectos de cartas**: Algunas cartas proporcionan recursos adicionales cada ronda.

5. **Victoria**: El juego termina cuando un jugador alcanza 7 o más puntos de victoria.

## 🛠️ Tecnologías utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **Socket.IO** - Comunicación en tiempo real

### Frontend
- **React** - Biblioteca de UI
- **Vite** - Herramienta de construcción
- **Socket.IO Client** - Cliente de tiempo real

## 📁 Estructura del proyecto

```
mint-works/
├── server/
│   ├── index.js           # Servidor principal
│   ├── Game.js            # Lógica del juego
│   └── gameConstants.js   # Constantes del juego
├── client/
│   ├── src/
│   │   ├── components/    # Componentes de React
│   │   ├── App.jsx        # Componente principal
│   │   └── main.jsx       # Punto de entrada
│   ├── public/            # Archivos estáticos
│   └── package.json       # Dependencias del cliente
├── package.json           # Dependencias del servidor
└── README.md              # Este archivo
```

## 🎨 Capturas de pantalla

### Lobby
Los jugadores pueden crear o unirse a partidas existentes.

### Tablero de juego
Interfaz completa con:
- Panel de jugadores con recursos
- Ubicaciones para colocar trabajadores
- Mercado de cartas de desarrollo
- Indicadores de turno

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

ISC

## 👥 Autores

Proyecto desarrollado para versión web multijugador de Mint Works.

---

¡Disfruta jugando Mint Works! 🎉
