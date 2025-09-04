import CampNotifications from '@/components/CampTop/CampNotifications.vue'
import { it, expect } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import type { components } from '@/api/schema'

type Camp = components['schemas']['CampResponse']

const now = new Date()

const defaultCamp: Camp = {
  id: 1,
  name: '2025テスト合宿',
  dateStart: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
  dateEnd: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate() + 1}`,
  displayId: 'camp25test',
  guidebook: 'aaaaaaaa',
  isDraft: false,
  isPaymentOpen: false,
  isRegistrationOpen: false,
}

const txtList = [
  'この合宿は現在下書きに設定されています',
  'この合宿は現在参加登録を受け付けています',
  'この合宿は現在参加費の振込期間中です',
  '下書き設定と参加登録の設定が同時に有効になっています',
  '下書き設定と合宿費の振込期間中の設定が同時に有効になっています',
  '参加登録の設定と合宿費の振込期間中の設定が同時に有効になっています',
  'この合宿は開始日を過ぎていますが、参加登録が有効になっています',
]

describe('CampNotifications', () => {
  it('no notification', () => {
    const wrapper = mount(CampNotifications, {
      props: {
        camp: {
          ...defaultCamp,
        },
      },
    })
    txtList.forEach((txt) => {
      expect(wrapper.text()).not.toContain(txt)
    })
  })
  it('draft camp', () => {
    const wrapper = mount(CampNotifications, {
      props: {
        camp: {
          ...defaultCamp,
          isDraft: true,
        },
      },
    })
    const target = [txtList[0]]
    txtList
      .filter((txt) => target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).toContain(txt)
      })
    txtList
      .filter((txt) => !target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).not.toContain(txt)
      })
  })
  it('registration open', () => {
    const wrapper = mount(CampNotifications, {
      props: {
        camp: {
          ...defaultCamp,
          isRegistrationOpen: true,
        },
      },
    })
    const target = [txtList[1]]
    txtList
      .filter((txt) => target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).toContain(txt)
      })
    txtList
      .filter((txt) => !target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).not.toContain(txt)
      })
  })
  it('payment open', () => {
    const wrapper = mount(CampNotifications, {
      props: {
        camp: {
          ...defaultCamp,
          isPaymentOpen: true,
        },
      },
    })
    const target = [txtList[2]]
    txtList
      .filter((txt) => target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).toContain(txt)
      })
    txtList
      .filter((txt) => !target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).not.toContain(txt)
      })
  })
  it('draft and registration open', () => {
    const wrapper = mount(CampNotifications, {
      props: {
        camp: {
          ...defaultCamp,
          isDraft: true,
          isRegistrationOpen: true,
        },
      },
    })
    const target = [txtList[0], txtList[1], txtList[3]]
    txtList
      .filter((txt) => target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).toContain(txt)
      })
    txtList
      .filter((txt) => !target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).not.toContain(txt)
      })
  })
  it('draft and payment open', () => {
    const wrapper = mount(CampNotifications, {
      props: {
        camp: {
          ...defaultCamp,
          isDraft: true,
          isPaymentOpen: true,
        },
      },
    })
    const target = [txtList[0], txtList[2], txtList[4]]
    txtList
      .filter((txt) => target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).toContain(txt)
      })
    txtList
      .filter((txt) => !target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).not.toContain(txt)
      })
  })
  it('payment and registration open', () => {
    const wrapper = mount(CampNotifications, {
      props: {
        camp: {
          ...defaultCamp,
          isRegistrationOpen: true,
          isPaymentOpen: true,
        },
      },
    })
    const target = [txtList[1], txtList[2], txtList[5]]
    txtList
      .filter((txt) => target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).toContain(txt)
      })
    txtList
      .filter((txt) => !target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).not.toContain(txt)
      })
  })
  it('draft, payment and registration open', () => {
    const wrapper = mount(CampNotifications, {
      props: {
        camp: {
          ...defaultCamp,
          isDraft: true,
          isRegistrationOpen: true,
          isPaymentOpen: true,
        },
      },
    })
    const target = [txtList[0], txtList[1], txtList[2], txtList[3], txtList[4], txtList[5]]
    txtList
      .filter((txt) => target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).toContain(txt)
      })
    txtList
      .filter((txt) => !target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).not.toContain(txt)
      })
  })
  it('registration open after start date', () => {
    const wrapper = mount(CampNotifications, {
      props: {
        camp: {
          ...defaultCamp,
          isRegistrationOpen: true,
          dateStart: '2025-01-01',
        },
      },
    })
    const target = [txtList[1], txtList[6]]
    txtList
      .filter((txt) => target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).toContain(txt)
      })
    txtList
      .filter((txt) => !target.includes(txt))
      .forEach((txt) => {
        expect(wrapper.text()).not.toContain(txt)
      })
  })
})
