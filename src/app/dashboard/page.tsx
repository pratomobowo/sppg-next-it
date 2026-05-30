'use client'

import { useState } from 'react'
import type { DateRange } from 'react-day-picker'

import { Card } from '@/components/ui/card'

import { GreetingHeader } from '@/components/greeting-header'
import { SortableWidgets } from '@/components/dashboard/sortable-widgets'
import { DateRangePicker } from '@/components/dashboard/date-range-picker'
import { currentUser } from '@/config/user'

import ProductInsightsCard from '@/components/shadcn-studio/blocks/widget-product-insights'
import SalesMetricsCard from '@/components/shadcn-studio/blocks/chart-sales-metrics'
import StatisticsCard from '@/components/shadcn-studio/blocks/statistics-card-01'
import TotalEarningCard from '@/components/shadcn-studio/blocks/widget-total-earning'
import TransactionDatatable from '@/components/shadcn-studio/blocks/datatable-transaction'

import { earningData, statisticsCardData, transactionData } from './data'

const DashboardShell = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <GreetingHeader name={currentUser.firstName} />
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>
      <div className='grid gap-4 sm:grid-cols-3 md:max-lg:grid-cols-1'>
        {statisticsCardData.map((card, index) => (
          <StatisticsCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            changePercentage={card.changePercentage}
          />
        ))}
      </div>

      <SortableWidgets
        storageKey='mocci:dashboard-widgets'
        widgets={[
          {
            id: 'insights-earning',
            content: (
              <div className='grid gap-4 lg:grid-cols-2'>
                <ProductInsightsCard className='justify-between gap-2 *:data-[slot=card-content]:space-y-4' />
                <TotalEarningCard
                  title='Total Earning'
                  earning={24650}
                  trend='up'
                  percentage={10}
                  comparisonText='Compare to last year ($84,325)'
                  earningData={earningData}
                  className='justify-between gap-4 sm:min-w-0'
                />
              </div>
            )
          },
          {
            id: 'sales-metrics',
            content: (
              <SalesMetricsCard className='*:data-[slot=card-content]:space-y-4' />
            )
          },
          {
            id: 'transactions',
            content: (
              <Card className='w-full py-0'>
                <TransactionDatatable data={transactionData} />
              </Card>
            )
          }
        ]}
      />
    </div>
  )
}

export default DashboardShell
