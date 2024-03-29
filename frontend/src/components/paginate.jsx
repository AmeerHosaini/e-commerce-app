import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, isAdmin = false, keyword = "" }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((pageNumber) => (
          <LinkContainer
            key={pageNumber + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${pageNumber + 1}`
                  : `/page/${pageNumber + 1}`
                : `/admin/productlist/${pageNumber + 1}`
            }
          >
            <Pagination.Item
              className="shadow"
              active={pageNumber + 1 === page}
            >
              {pageNumber + 1}
            </Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;

// take number of pages and map through number of pages as array
// LinkContainer is gonna depend on whether there is a keyword or not
