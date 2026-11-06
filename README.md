# PC Build Planner

A web app for planning a PC build. Pick your parts and see straight away if they work together, plus your total price and how much power the build needs.

**Live demo:** [pcbuildplanner.vercel.app](https://pcbuildplanner.vercel.app)

![Welcome page](src/assets/Pc_welcomepage.png)

## Features

- 3D RTX 4090 model on the welcome page that you can drag around
- Pick a CPU, motherboard, RAM, GPU and power supply from a slide-in part picker
- Compatibility checks:
  - CPU socket has to match the motherboard
  - RAM type (DDR4 / DDR5) has to match the motherboard
  - PSU wattage has to cover the CPU + GPU + 100W headroom
- Parts that don't fit are greyed out with the reason
- Live total price and power usage bar
- Warning when the PSU is running above 80% load

## Tech Stack

- React (Vite)
- React Three Fiber + Drei (3D model)
- CSS
- Deployed on Vercel

## Run it locally

```
npm install
npm run dev
```

## Coming next

- Backend with Node.js, Express and MongoDB
- Save builds and share them with a link

## Credits

3D model: ["GeForce RTX 4090 Founders Edition"](SKETCHFAB-LINK) by Alexander Ershov (exéla) on Sketchfab, licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). The model was rotated and scaled for this project.

Part prices are rough SGD estimates and only for demo purposes.

## Author

Angelo, Year 2 IT student at Republic Polytechnic
GitHub: [Aangelo555](https://github.com/Aangelo555)
