const ArrowLeft = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<path d='m12 19-7-7 7-7' />
		<path d='M19 12H5' />
	</svg>
)

const ChevronRight = () => (
	<svg
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<path d='m9 18 6-6-6-6' />
	</svg>
)

const BurgerIcon = () => (
	<svg
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<line x1='4' y1='12' x2='20' y2='12'></line>
		<line x1='4' y1='6' x2='20' y2='6'></line>
		<line x1='4' y1='18' x2='20' y2='18'></line>
	</svg>
)

export { ArrowLeft, ChevronRight, BurgerIcon }
