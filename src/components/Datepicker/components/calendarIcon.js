export default {
  name: 'CalendarIcon',

  render () {
    const currentDay = new Date().getDate()

    return (
      <span class="mx-input-append">
        <slot name="calendar-input-icon">
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 200 200" class="mx-calendar-icon">
            <rect x="13" y="29" rx="14" ry="14" width="174" height="158" fill="transparent" />
            <line x1="46" x2="46" y1="8" y2="50" />
            <line x1="154" x2="154" y1="8" y2="50" />
            <line x1="13" x2="187" y1="70" y2="70" />
            <text x="50%" y="135" font-size="90" stroke-width="1" text-anchor="middle" dominant-baseline="middle">{ currentDay }</text>
          </svg>
        </slot>
      </span>
    )
  }
}
