import Posts from "../posts/Posts";
import { useGetPostsByUserIdQuery } from "../../store/Posts/PostSliceRedux";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
const UserPosts = () => {

    const { id } = useParams();

    const { data: posts, isLoading } = useGetPostsByUserIdQuery(id);
    console.log(posts);

    return (
        <Container>
            <Row className="d-flex align-items-center justify-content-center">
                <Col lg={6}>
                    {isLoading && <div className="loader"></div>}
                    {
                        posts && posts.map((x, i) => (
                            <Posts key={i} postId={x.postId} />
                        ))
                    }
                </Col>
            </Row>
        </Container>
    )
}

export default UserPosts