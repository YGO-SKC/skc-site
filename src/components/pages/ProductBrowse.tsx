import '../../css/main-pages/product.css'

import { useState, useEffect, lazy, FunctionComponent, Suspense, useCallback, startTransition } from 'react'
import { Helmet } from 'react-helmet'

import FetchHandler from '../../helper/FetchHandler'
import DownstreamServices from '../../helper/DownstreamServices'

import { Dates } from '../../helper/Dates'
import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Skeleton } from '@mui/material'

const Breadcrumb = lazy(() => import('../header-footer/Breadcrumb'))
const ProductGrid = lazy(() => import('../product/ProductGrid'))
const Section = lazy(() =>
	import('skc-rcl').then((module) => {
		return { default: module.Section }
	})
)

const ProductBrowse: FunctionComponent = () => {
	const [products, setProducts] = useState<ProductInfo[]>([])
	const [productGridItems, setProductGridItems] = useState<JSX.Element[]>([])

	const [isDataLoaded, setIsDataLoaded] = useState(false)
	const [showAllProducts, setShowAllProducts] = useState(false)

	const [productTypes, setProductTypes] = useState<JSX.Element[]>([<FormControlLabel key='All' value='All' control={<Radio />} label='All' />])
	const [productTypeFilter, setProductTypeFilter] = useState('')

	useEffect(() => {
		FetchHandler.handleFetch<ProductBrowseResults>(DownstreamServices.NAME_maps_ENDPOINT['productBrowse'], (json: ProductBrowseResults) => {
			setProducts(json.products)
		})
	}, [])

	useEffect(() => {
		const pt = Array.from(new Set(products.map((product: ProductInfo) => product.productType))).map((productType: string) => (
			<FormControlLabel key={productType} value={productType} control={<Radio />} label={productType} />
		))

		setProductTypes([...productTypes, ...pt])
		setProductTypeFilter('All')
	}, [products])

	useEffect(() => {
		startTransition(() => {
			const filteredProducts = products
				.filter((product: ProductInfo) => showAllProducts || +Dates.getYear(Dates.fromYYYYMMDDToDate(product.productReleaseDate)) > +Dates.getYear(new Date()) - 3)
				.filter((product: ProductInfo) => productTypeFilter === 'All' || product.productType === productTypeFilter)
				.reduce((map: Map<number, ProductInfo[]>, product: ProductInfo) => {
					const productReleaseDate = Dates.fromYYYYMMDDToDate(product.productReleaseDate)
					const year = +Dates.getYear(productReleaseDate)

					map.set(year, map.get(year) ?? [])
					map.get(year)!.push(product)
					return map
				}, new Map<number, ProductInfo[]>())

			setProductGridItems(Array.from(filteredProducts.keys()).map((year: number) => <ProductGrid key={year} section={String(year)} products={filteredProducts.get(year)!} />))
		})
	}, [products, showAllProducts, productTypeFilter])

	useEffect(() => {
		setIsDataLoaded(true)
	}, [productGridItems])

	const loadAllCB = useCallback(() => {
		setShowAllProducts(true)
	}, [])

	const handleFormatChanged = useCallback(
		(_: React.ChangeEvent<HTMLInputElement>, value: string) => {
			setProductTypeFilter(value)
		},
		[setProductTypeFilter]
	)

	return (
		<div className='generic-container'>
			<Helmet>
				<title>{`SKC - Product Browser`}</title>
				<meta name={`SKC - Product Browser`} content={`Browse all products in database to check the progression of YuGiOh.`} />
				<meta name='keywords' content={`YuGiOh, product browse, The Supreme Kings Castle`} />
			</Helmet>

			<Suspense fallback={<Skeleton className='breadcrumb-skeleton' variant='rectangular' width='100%' height='2.5rem' />}>
				<Breadcrumb crumbs={['Home', 'Product Browse']} />
			</Suspense>

			<Suspense fallback={<Skeleton className='rounded-skeleton' variant='rectangular' width='100%' height='40rem' />}>
				{isDataLoaded ? (
					<Section sectionHeaderBackground='product' sectionName='Products In Database'>
						<div className='section-content'>
							<FormControl>
								<FormLabel id='ban-list-format-label'>Product Type</FormLabel>
								<RadioGroup value={productTypeFilter} onChange={handleFormatChanged} row aria-labelledby='ban-list-format-label' name='ban-list-format-buttons-group'>
									{productTypes}
								</RadioGroup>
							</FormControl>

							{productGridItems}
							{showAllProducts ? undefined : <Button onClick={loadAllCB}>Display All Products</Button>}
						</div>
					</Section>
				) : undefined}
			</Suspense>
		</div>
	)
}

export default ProductBrowse
