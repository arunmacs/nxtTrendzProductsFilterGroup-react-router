import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const statusCode = {
  inProgress: 'IN_PROGRESS',
  noProducts: 'NO_PRODUCTS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiStatus: statusCode.inProgress,
    activeOptionId: sortbyOptions[0].optionId,
    titleSearch: '',
    category: '',
    rating: '',
  }

  componentDidMount() {
    console.log('componentMount')

    this.getProducts()
  }

  getProducts = async () => {
    console.log('apiCall')

    this.setState({
      apiStatus: statusCode.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const {activeOptionId, titleSearch, category, rating} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${titleSearch}&rating=${rating}`
    console.log(apiUrl)

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      console.log('responseOk')

      const fetchedData = await response.json()

      if (fetchedData.products.length !== 0) {
        console.log('data', fetchedData.products.length)

        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        this.setState({
          productsList: updatedData,
          apiStatus: statusCode.success,
        })
      } else {
        console.log('emptyData', fetchedData.products.length)

        this.setState({
          apiStatus: statusCode.noProducts,
        })
      }
    } else {
      console.log('failure')

      this.setState({
        apiStatus: statusCode.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  changeTitleSearch = value => {
    this.setState({titleSearch: value})
  }

  onSearchGetProducts = () => {
    this.getProducts()
  }

  changeCategoryOption = value => {
    this.setState({category: value}, this.getProducts)
  }

  changeRatingOption = value => {
    this.setState({rating: value}, this.getProducts)
  }

  onClickClearFilters = () => {
    console.log('cleared')

    this.setState(
      {
        apiStatus: statusCode.inProgress,
        activeOptionId: sortbyOptions[0].optionId,
        titleSearch: '',
        category: '',
        rating: '',
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    if (productsList === []) {
      return this.renderNoProductsView()
    }
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => {
    console.log('loader')

    return (
      <div className="products-loader-container">
        <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
    )
  }

  renderNoProductsView = () => (
    <div className="no-products-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="no-products"
      />
      <h1 className="no-product-text">No Products Found</h1>
      <p className="no-product-info">
        We could not find any products.Try other filters
      </p>
    </div>
  )

  checkStatusAndRenderProcess = () => {
    const {apiStatus} = this.state
    console.log('switch')

    switch (apiStatus) {
      case statusCode.inProgress:
        return this.renderLoader()
      case statusCode.success:
        console.log('success')
        return this.renderProductsList()
      case statusCode.noProducts:
        return this.renderNoProductsView()
      case statusCode.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="products-failure"
      />
      <h1 className="products-failure-text">Oops! Something Went Wrong</h1>
      <p className="products-failure-info">
        We are having some trouble processing your request.Please try again
      </p>
    </div>
  )

  render() {
    const {titleSearch} = this.state
    console.log('render')

    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryOptionsData={categoryOptions}
          ratingsListData={ratingsList}
          updateSearchKeyword={this.changeTitleSearch}
          updateCategoryOption={this.changeCategoryOption}
          updateRatingOption={this.changeRatingOption}
          clearFilters={this.onClickClearFilters}
          titleSearchValue={titleSearch}
          triggerSearch={this.onSearchGetProducts}
        />

        {this.checkStatusAndRenderProcess()}
      </div>
    )
  }
}

export default AllProductsSection
