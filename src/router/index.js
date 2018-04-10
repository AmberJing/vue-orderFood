import Vue from 'vue';
import VueRouter from 'vue-router';
import Goods from '@/components/goods/Goods';
import Ratings from '@/components/ratings/ratings';
import Seller from '@/components/seller/seller';

Vue.use(VueRouter);

var routes = [
  {
    path: '/goods',
    component: Goods
  },
  {
    path: '/ratings',
    component: Ratings
  },
  {
    path: '/seller',
    component: Seller
  },
  {
    path: '/',
    component: Goods
  },
  {
    path: '*',
    component: Goods
  }
];

export default new VueRouter({
  mode: 'history',
  routes,
  linkActiveClass: 'active'// 重定义active状态下的路由类名
});
