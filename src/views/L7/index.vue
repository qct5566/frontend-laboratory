<template>
  <div :class="$prefix('pd20')">
    <h1>
      L7-demo 缩放 {{ zoom.toFixed(2) }} 数据量
      {{ dataLen || '请等待...' }}
    </h1>
    <a-button
      type="primary"
      :class="$prefix('mr5')"
      v-for="item in mapTypes"
      :key="item.label"
      @click="changeL7(item)"
    >{{ item.label }}</a-button>
    <div id="L7-demo"></div>
  </div>
</template>

<script>
import L7Scene from './L7-option'
import { LineLayer, CityBuildingLayer, PointLayer } from '@antv/l7'
// import ELineLayer from '@/views/ECharts/ELineLayer.js'
export default {
  data () {
    return {
      currentId: '',
      mapTypes: [
        {
          label: '公交线路图',
          value: 'LineLayer',
          url:
            'https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json',
          map: {
            options: {
              pitch: 0,
              zoom: 16,
              center: [120.19382669582967, 30.258134]
            }
          }
        },
        {
          label: '流向图',
          value: 'LineLayer',
          map: {
            type: 'Mapbox',
            options: {
              pitch: 20,
              style: {
                version: 8,
                sprite: 'https://lzxue.github.io/font-glyphs/sprite/sprite',
                glyphs:
                  'https://gw.alipayobjects.com/os/antvdemo/assets/mapbox/glyphs/{fontstack}/{range}.pbf',
                sources: {},
                layers: [
                  {
                    id: 'background',
                    type: 'background',
                    paint: {
                      'background-color': '#2b2b3a'
                    }
                  }
                ]
              },
              center: [3.438, 40.16797],
              zoom: 1
            }
          }
        },
        {
          label: '点亮城市',
          value: 'CityBuildingLayer',
          map: {
            options: {
              center: [120.173104, 30.244072],
              pitch: 70.41138037735848,
              zoom: 17.18,
              rotation: 2.24, // 358.7459759480504
              minZoom: 12
            }
          }
        },
        {
          label: '弧线渲染',
          value: 'LineLayer',
          map: {
            type: 'Mapbox',
            options: {
              pitch: 0,
              style: 'dark',
              center: [107.77791556935472, 35.443286920228644],
              zoom: 3
            }
          }
        }
      ],
      L7Scene: null,
      loading: false,
      zoom: 1,
      dataLen: 0
    }
  },
  mounted () {
    this.changeL7(this.mapTypes[0])
  },
  methods: {
    init (item) {
      if (this.L7Scene) this.L7Scene.destroy()
      this.currentId = `L7-${item.value}`
      // 初始化
      this.L7Scene = L7Scene({
        id: 'L7-demo',
        map: item.map
      })
      this.zoom = this.L7Scene.getZoom()
      // ELineLayer()
      this.L7Scene.on('zoomend', () => {
        this.zoom = this.L7Scene.getZoom()
      })
    },
    async changeL7 (item) {
      this.dataLen = 0
      this.loading = true
      this.init(item)
      await this.$nextTick()
      switch (item.label) {
        case '公交线路图':
          this.L7Scene.on('loaded', async () => {
            const res = await fetch(item.url)
            const data = await res.json()
            let layer = null
            this.dataLen = data.features.length
            layer = new LineLayer()
              .source(data)
              .size(1.5)
              .shape('line')
              .color('#25d8b7')
              .animate({
                interval: 1, // 间隔
                duration: 1, // 持续时间，延时
                trailLength: 2 // 流线长度
              })

            if (layer) this.L7Scene.addLayer(layer)
          })
          break
        case '点亮城市':
          this.CityBuildingLayer()
          break
        case '弧线渲染':
          this.demo3()
          break
        case '流向图':
          this.demo2()
          break
      }
      this.loading = false
    },
    CityBuildingLayer () {
      this.dataLen = 0
      this.L7Scene.on('loaded', () => {
        fetch(
          'https://gw.alipayobjects.com/os/rmsportal/ggFwDClGjjvpSMBIrcEx.json'
        )
          .then((res) => res.json())
          .then((data) => {
            this.dataLen += data.features.length
            console.log('data1', data)
            const layer = new CityBuildingLayer({
              zIndex: 0
            })
            layer
              .source(data)
              .size('floor', [100, 3000])
              .color('rgba(242,246,250,0.5)')
              .animate({
                enable: true
              })
              .style({
                opacity: 1.0,
                baseColor: 'rgba(36,16,63,0.3)',
                windowColor: '#0e0220',
                brightColor: '#08faee'
              })
            this.L7Scene.addLayer(layer)
          })
        fetch(
          'https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json'
        )
          .then((res) => res.json())
          .then((data) => {
            this.dataLen += data.features.length
            const layer = new LineLayer({
              zIndex: 0
            })
              .source(data)
              .size(1)
              .shape('line')
              .color('#ff893a')
              .animate({
                interval: 1, // 间隔
                duration: 2, // 持续时间，延时
                trailLength: 2 // 流线长度
              })
            this.L7Scene.addLayer(layer)
            this.loading = false
          })
      })
    },
    demo3 () {
      this.L7Scene.on('loaded', () => {
        fetch(
          'https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt'
        )
          .then((res) => res.text())
          .then((data) => {
            this.dataLen = data.length
            const layer = new LineLayer({})
              .source(data, {
                parser: {
                  type: 'csv',
                  x: 'lng1',
                  y: 'lat1',
                  x1: 'lng2',
                  y1: 'lat2'
                }
              })
              .size(1)
              .shape('greatcircle')
              .color('#8C1EB2')
              .style({
                opacity: 0.8
              })
            this.L7Scene.addLayer(layer)
          })
      })
    },
    demo2 () {
      const _this = this
      this.L7Scene.on('loaded', () => {
        Promise.all([
          fetch(
            'https://gw.alipayobjects.com/os/basement_prod/dbd008f1-9189-461c-88aa-569357ffc07d.json'
          ).then((d) => d.json()),
          fetch(
            'https://gw.alipayobjects.com/os/basement_prod/4472780b-fea1-4fc2-9e4b-3ca716933dc7.json'
          ).then((d) => d.text()),
          fetch(
            'https://gw.alipayobjects.com/os/basement_prod/a5ac7bce-181b-40d1-8a16-271356264ad8.json'
          ).then((d) => d.text())
        ]).then(function onLoad ([world, dot, flyline]) {
          _this.dataLen = world.features.length + dot.length + flyline.length
          /* eslint-disable */
          const dotData = eval(dot)
          const flydata = eval(flyline).map((item) => {
            const latlng1 = item.from.split(',').map((e) => {
              return e * 1
            })
            const latlng2 = item.to.split(',').map((e) => {
              return e * 1
            })
            return { coord: [latlng1, latlng2] }
          })
          // const worldFill = new PolygonLayer()
          //   .source(world)
          //   .color('#98E3FA')
          //   .shape('fill')
          //   .style({
          //     opacity: 1
          //   });

          const worldLine = new LineLayer()
            .source(world)
            .color('#41fc9d')
            .size(0.5)
            .style({
              opacity: 0.4,
            })
          const dotPoint = new PointLayer()
            .source(dotData, {
              parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
              },
            })
            .shape('circle')
            .color('#ffed11')
            .animate(true)
            .size(40)
            .style({
              opacity: 1.0,
            })
          const flyLine = new LineLayer()
            .source(flydata, {
              parser: {
                type: 'json',
                coordinates: 'coord',
              },
            })
            .color('#ff6b34')
            .shape('arc3d')
            .size(2)
            .active(true)
            .animate({
              interval: 2,
              trailLength: 2,
              duration: 1,
            })
            .style({
              opacity: 1,
            })
          // scene.addLayer(worldFill);
          _this.L7Scene.addLayer(worldLine)
          _this.L7Scene.addLayer(dotPoint)
          _this.L7Scene.addLayer(flyLine)
        })
      })
    },
  },
}
</script>

<style>
#L7-demo {
  margin: 20px 0;
  height: calc(100vh - 170px);
  position: relative;
}
</style>
