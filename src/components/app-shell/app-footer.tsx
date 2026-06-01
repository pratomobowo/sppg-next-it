export function AppFooter() {
  return (
    <div className='text-muted-foreground flex w-full items-center justify-between gap-3 px-3 py-2 max-sm:flex-col sm:gap-6 sm:px-4'>
      <p className='text-sm text-balance max-sm:text-center'>
        {`©${new Date().getFullYear()} `}
        <span className='text-foreground font-medium'>PT Niaga Expert Teknologi</span>
        {'. Sistem Monitoring SPPG MBG.'}
      </p>
    </div>
  )
}
