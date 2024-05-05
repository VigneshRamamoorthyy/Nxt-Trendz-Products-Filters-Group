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

const apiStatusConstants = {
  initial: 'INITIAL',
  progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    activeCategoryId: '',
    activeRatingId: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.progress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      searchInput,
      activeCategoryId,
      activeRatingId,
      noProblem,
    } = this.state
    console.log(searchInput)
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
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
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  enterSearchInput = () => {
    this.getProducts()
  }

  changeSearchInput = searchInput => {
    this.setState({
      searchInput,
    })
  }

  onApplyCategory = activeCategoryId => {
    this.setState(
      {
        activeCategoryId,
      },
      this.getProducts,
    )
  }

  onApplyRating = activeRatingId => {
    this.setState(
      {
        activeRatingId,
      },
      this.getProducts,
    )
  }

  onClearFilters = () => {
    this.setState(
      {
        searchInput: '',
        activeCategoryId: '',
        activeRatingId: '',
      },
      this.getProducts,
    )
  }

  renderNoProductsView = () => (
    <div className="no-products-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        className="no-products-img"
        alt="no products"
      />
      <h1 className="no-product-heading">No Products Found</h1>
      <p className="no-products-description">
        We could not find any products. Try other filters.
      </p>
    </div>
  )

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    if (productsList.length === 0) {
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

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div className="no-products-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="no-products-img"
      />
      <h1 className="no-product-heading">Oops! Something Went Wrong</h1>
      <p className="no-products-description">
        We are having some trouble processing your request.
      </p>
      <p className="no-products-description">Please try again later.</p>
    </div>
  )

  renderOutputView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsList()
      case apiStatusConstants.progress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailure()

      default:
        return null
    }
  }

  render() {
    const {activeCategoryId, searchInput} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          searchInput={searchInput}
          enterSearchInput={this.enterSearchInput}
          changeSearchInput={this.changeSearchInput}
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          onApplyCategory={this.onApplyCategory}
          activeCategoryId={activeCategoryId}
          onApplyRating={this.onApplyRating}
          onClearFilters={this.onClearFilters}
        />

        {this.renderOutputView()}
      </div>
    )
  }
}

export default AllProductsSection
