/** @type {import('tailwindcss').Config} */
import { neutral } from './src/config/colors'
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  separator: '__',
  theme: {
    extend: {
      colors: {
        neutral,
        success: {
          DEFAULT: '#52c41a',
          '50': '#f6ffed',
          '100': '#d9f7be',
          '200': '#b7eb8f',
          '300': '#95de64',
          '400': '#73d13d',
          '500': '#52c41a',
          '600': '#389e0d',
          '700': '#237804',
          '800': '#135200',
          '900': '#092b00',
        },
        warning: {
          DEFAULT: '#faad14',
          '50': '#fffbe6',
          '100': '#fff1b8',
          '200': '#ffe58f',
          '300': '#ffd666',
          '400': '#ffc53d',
          '500': '#faad14',
          '600': '#d48806',
          '700': '#ad6800',
          '800': '#874d00',
          '900': '#613400',
        },
        error: {
          DEFAULT: '#ff4d4f',
          '50': '#fff2f0',
          '100': '#ffd4d6',
          '200': '#ffb1b3',
          '300': '#ff8f90',
          '400': '#ff666a',
          '500': '#ff4d4f',
          '600': '#d9363e',
          '700': '#b3242b',
          '800': '#8c151a',
          '900': '#66060b',
        },
      },
      fontSize: {
        'xs': '20rpx',
        '2xs': '22rpx',
        'sm': '24rpx',
        'base': '28rpx',
        'md': '30rpx',
        'lg': '32rpx',
        'xl': '36rpx',
        '2xl': '40rpx',
        '3xl': '48rpx',
        '4xl': '56rpx',
        '5xl': '64rpx',
        '6xl': '72rpx',
      },
      padding : {
        'page-x' : '32rpx', //页左右边距
        'page-y' : '24rpx', //页上下边距
      },
      borderRadius: {
        'page' : '16rpx',
      }
    }
  },
  variants: {},
  plugins: [],
  corePlugins: {
    preflight: false,
    space: false,
    divideColor: false,
    divideOpacity: false,
    divideStyle: false,
    divideWidth: false
  }
};
