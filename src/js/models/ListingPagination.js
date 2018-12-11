const ko = require('knockout')

class PaginationLink {
  constructor (listener, pageNumber, isCurrent) {
    this.listener = listener
    this.pageNumber = ko.observable(pageNumber)
    this.isCurrent = ko.observable(isCurrent)
    this.changePage = function () {
      this.listener.changePage(this.pageNumber())
    }
  }
}

/** Controls pagination */
export default class ListingPagination {
  /**
   * Constructor
   * @param {*} listingModel // the knockout listing model; eg \models\service-providers\listing.js
   * @param {number} pageSize
   */
  constructor (listingModel, pageSize = 10) {
    this.listingModel = listingModel
    this.index = 0
    this.pageSize = pageSize
    this.hasItems = ko.observable(false)
  }

  /**
   * on requesting new page (from event in PaginationLink)
   */
  changePage (pageNumber) {
    this.index = (pageNumber - 1) * this.pageSize
    this.listingModel.loadDocuments()
  }

  /**
   * on receiving new data from api
   * @param { paginated data from api } paginatedData
   */
  updateData (paginatedData) {
    const totalPages = Math.ceil(paginatedData.total / this.pageSize)
    this.hasItems(paginatedData.items.length > 0)
    const currentPage = Math.ceil(this.index / this.pageSize)
    this.listingModel.paginationLinks(Array.from({ length: totalPages })
      .map((_, i) => new PaginationLink(this, i + 1, currentPage === i)))
  }

  get hasPages () {
    return this.listingModel.paginationLinks().length > 1
  }
}
