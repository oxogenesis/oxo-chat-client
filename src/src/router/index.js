import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Main',
      component: require('@/components/Main').default
    },
    {
      path: '/CreateAccount',
      name: 'CreateAccount',
      component: require('@/components/CreateAccount').default
    },
    {
      path: '/CreateAccountNew',
      name: 'CreateAccountNew',
      component: require('@/components/CreateAccountNew').default
    },
    {
      path: '/CreateAccountWithSeed',
      name: 'CreateAccountWithSeed',
      component: require('@/components/CreateAccountWithSeed').default
    },
    {
      path: '/Login',
      name: 'Login',
      component: require('@/components/Login').default
    },
    {
      path: '/Home',
      name: 'Home',
      component: require('@/components/Home').default
    },
    {
      path: '/Setting',
      name: 'Setting',
      component: require('@/components/Setting').default
    },
    {
      path: '/Network',
      name: 'Network',
      component: require('@/components/Network').default
    },
    {
      path: '/Contact',
      name: 'Contact',
      component: require('@/components/Contact').default
    },
    {
      path: '/Group',
      name: 'Group',
      component: require('@/components/Group').default
    },
    {
      path: '/BBs',
      name: 'BBs',
      component: require('@/components/BBs').default
    },
    {
      path: '/BBs/:address',
      name: 'BBs',
      component: require('@/components/BBs').default
    },
    {
      path: '/Sessions',
      name: 'Sessions',
      component: require('@/components/Sessions').default
    },
    {
      path: '/Sessions/:session',
      name: 'Sessions',
      component: require('@/components/Sessions').default
    },
    {
      path: '/GroupMember/:group_hash',
      name: 'GroupMember',
      component: require('@/components/GroupMember').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
