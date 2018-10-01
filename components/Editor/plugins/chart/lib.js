import { Block } from 'slate'

const random = () => Math.round(Math.random() * 10) / 10

export const getNew = () =>
  Block.create({
    type: 'chart',
    nodes: [
      Block.create({ type: 'chartTitle' }),
      Block.create({ type: 'chartLead' }),
      Block.create({
        type: 'chartCanvas',
        data: {
          isNew: true,
          config: { type: 'Bar', y: 'label' },
          values: `label,value\nA,${random()}\nB,${random()}`
        }
      }),
      Block.create({ type: 'chartNote' })
    ]
  })
