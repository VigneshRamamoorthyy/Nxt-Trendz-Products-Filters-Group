import {BsSearch} from 'react-icons/bs'

import './index.css'

const FiltersGroup = props => {
  const {
    searchInput,
    enterSearchInput,
    changeSearchInput,
    categoryOptions,
    ratingsList,
    onApplyCategory,
    activeCategoryId,
    onApplyRating,
    onClearFilters,
  } = props

  const onClickCategory = id => {
    onApplyCategory(id)
  }

  const onClickRating = id => {
    onApplyRating(id)
  }

  const onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  const onChangeSearchInput = event => {
    changeSearchInput(event.target.value)
  }

  const renderSearchInput = () => (
    <>
      <div className="input-search-container">
        <input
          type="search"
          className="input-search-element"
          placeholder="Search"
          onKeyPress={onEnterSearchInput}
          onChange={onChangeSearchInput}
          value={searchInput}
        />
        <BsSearch />
      </div>
    </>
  )

  const renderCategoryItems = () => (
    <>
      <h1 className="filters-heading">Category</h1>
      <ul className="filter-lists">
        {categoryOptions.map(eachOption => (
          <li
            key={eachOption.categoryId}
            onClick={() => onClickCategory(eachOption.categoryId)}
          >
            <p
              className={
                eachOption.categoryId === activeCategoryId
                  ? 'category-btn active-category-btn'
                  : 'category-btn'
              }
            >
              {eachOption.name}
            </p>
          </li>
        ))}
      </ul>
    </>
  )

  const renderRatingList = () => (
    <>
      <h1 className="filters-heading">Rating</h1>
      <ul className="filter-lists">
        {ratingsList.map(eachRating => (
          <li
            key={eachRating.ratingId}
            className="rating-list"
            onClick={() => onClickRating(eachRating.ratingId)}
          >
            <div className="rating-star-container">
              <img
                src={eachRating.imageUrl}
                className="star-img"
                alt={`rating ${eachRating.ratingId}`}
              />
              <p className="rating-upward">& up</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )

  return (
    <div className="filters-group-container">
      {renderSearchInput()}
      {renderCategoryItems()}
      {renderRatingList()}
      <button
        className="clear-filter-btn"
        onClick={onClearFilters}
        type="button"
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
