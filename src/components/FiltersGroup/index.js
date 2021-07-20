import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const {updateSearchKeyword, titleSearchValue, clearFilters} = props

  const onChangeTitleSearch = event => {
    updateSearchKeyword(event.target.value)
  }

  const onChangeFilters = () => {
    clearFilters()
  }

  const renderCategoryList = () => {
    const {categoryOptionsData, updateCategoryOption} = props

    return categoryOptionsData.map(option => {
      const onClickCategoryOption = () =>
        updateCategoryOption(option.categoryId)

      return (
        <p
          key={option.categoryId}
          onClick={onClickCategoryOption}
          className="category-item"
        >
          {option.name}
        </p>
      )
    })
  }

  const renderRatingList = () => {
    const {ratingsListData, updateRatingOption} = props

    return ratingsListData.map(rating => {
      const onClickRatingOption = () => updateRatingOption(rating.ratingId)

      return (
        <li
          key={rating.ratingId}
          onClick={onClickRatingOption}
          className="rating-item"
        >
          <img
            src={rating.imageUrl}
            alt={`rating-${rating.ratingId}`}
            className="rating-img"
          />
          <p className="rating-and-up-text"> & up</p>
        </li>
      )
    })
  }

  return (
    <div className="filters-group-container">
      <div className="search-container">
        <input
          type="search"
          value={titleSearchValue}
          onChange={onChangeTitleSearch}
          className="input"
          placeholder="Search"
        />
        <BsSearch className="search-icon" />
      </div>
      <div className="category-container">
        <h1 className="category-text">Category</h1>
        <div className="category-list">{renderCategoryList()}</div>
      </div>
      <div className="ratings-container">
        <h1 className="rating-text">Rating</h1>
        <ul className="ratings-list">{renderRatingList()}</ul>
      </div>
      <button
        type="button"
        onClick={onChangeFilters}
        className="clear-filter-button"
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
