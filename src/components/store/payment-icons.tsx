const iconCls = 'h-6 w-6 text-zinc-400'

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 9.5h19" />
      <path d="M6 15h4" />
    </svg>
  )
}

function CashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <rect x="2.5" y="7" width="19" height="11" rx="2.5" />
      <circle cx="12" cy="12.5" r="2.8" />
      <path d="M6 7V5.5M18 7V5.5" />
    </svg>
  )
}

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <path d="M3 9.5 12 4l9 5.5" />
      <path d="M5 9.5V18M9.5 9.5V18M14.5 9.5V18M19 9.5V18" />
      <path d="M3 20h18" />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <path d="M2 6h12v11H2z" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="18.5" r="1.8" />
      <circle cx="17" cy="18.5" r="1.8" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

function PackageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
      <path d="M12 3 3 7.5v9L12 21l9-4.5v-9z" />
      <path d="M3 7.5 12 12l9-4.5M12 12v9" />
    </svg>
  )
}

export function PaymentMethods() {
  const items = [
    { label: 'Mercado Pago', Icon: CashIcon },
    { label: 'Tarjeta', Icon: CardIcon },
    { label: 'Transferencia', Icon: BankIcon },
    { label: 'Efectivo', Icon: CashIcon },
  ]
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-600">
        Pagás con
      </p>
      <ul className="flex flex-wrap gap-2">
        {items.map(({ label, Icon }) => (
          <li
            key={label}
            className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300"
          >
            <Icon />
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ShippingMethods() {
  const items = [
    { label: 'Envío a todo el país', Icon: TruckIcon },
    { label: 'Correo Argentino', Icon: PackageIcon },
    { label: 'Retiro en el local', Icon: MapPinIcon },
  ]
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-600">
        Recibí tu pedido
      </p>
      <ul className="flex flex-wrap gap-2">
        {items.map(({ label, Icon }) => (
          <li
            key={label}
            className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300"
          >
            <Icon />
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
