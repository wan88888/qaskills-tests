package com.qaskills.jsonplaceholder.tests.crud;

import com.qaskills.jsonplaceholder.base.BaseTest;
import com.qaskills.jsonplaceholder.endpoints.APIConstants;
import com.qaskills.jsonplaceholder.pojos.request.Comment;
import com.qaskills.jsonplaceholder.pojos.request.Post;
import io.qameta.allure.Description;
import io.qameta.allure.Owner;
import io.restassured.RestAssured;
import org.testng.annotations.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class TestPostsCrud extends BaseTest {

    @Test(groups = "reg", priority = 1)
    @Owner("qaskills")
    @Description("GET /posts/1 - retrieve single post")
    public void testGetPostById() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.POSTS_URL + "/1")
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);

        Post post = payloadManager.postFromJson(response.asString());
        assertActions.verifyStringKeyNotNull(post.getId());
        assertActions.verifyResponseBody(post.getId(), 1, "post id");
        assertActions.verifyStringKeyNotNull(post.getTitle());
        assertActions.verifyStringKeyNotNull(post.getBody());
    }

    @Test(groups = "reg", priority = 2)
    @Description("GET /posts/1/comments - nested comments")
    public void testGetPostComments() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.POSTS_URL + "/1/comments")
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);

        List<Comment> comments = payloadManager.commentListFromJson(response.asString());
        assertThat(comments).isNotEmpty();
        assertThat(comments).allMatch(comment -> comment.getPostId().equals(1));
    }

    @Test(groups = "reg", priority = 3)
    @Description("POST /posts - create post")
    public void testCreatePost() {
        String payload = payloadManager.createPostPayloadAsString();

        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.POSTS_URL)
                .body(payload)
                .when()
                .post();

        validatableResponse = response.then();
        validatableResponse.statusCode(201);

        Post post = payloadManager.postFromJson(response.asString());
        assertActions.verifyResponseBody(post.getId(), 101, "created post id");
        assertActions.verifyStringKey(post.getTitle(), "REST Assured API test post");
    }

    @Test(groups = "reg", priority = 4)
    @Description("PUT /posts/1 - replace post")
    public void testReplacePost() {
        String payload = payloadManager.createPostPayloadAsString();

        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.POSTS_URL + "/1")
                .body(payload)
                .when()
                .put();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);

        Post post = payloadManager.postFromJson(response.asString());
        assertActions.verifyResponseBody(post.getId(), 1, "post id");
        assertActions.verifyStringKey(post.getTitle(), "REST Assured API test post");
    }

    @Test(groups = "reg", priority = 5)
    @Description("PATCH /posts/1 - partial update")
    public void testPatchPost() {
        String payload = payloadManager.updatePostTitlePayload("Patched via REST Assured");

        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.POSTS_URL + "/1")
                .body(payload)
                .when()
                .patch();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);

        Post post = payloadManager.postFromJson(response.asString());
        assertActions.verifyStringKey(post.getTitle(), "Patched via REST Assured");
    }

    @Test(groups = "reg", priority = 6)
    @Description("DELETE /posts/1 - delete post")
    public void testDeletePost() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.POSTS_URL + "/1")
                .when()
                .delete();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);
    }

    @Test(groups = "reg", priority = 7)
    @Description("GET /posts/9999 - non-existent post returns 404")
    public void testGetPostNotFound() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.POSTS_URL + "/9999")
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(404);
    }

    @Test(groups = "qa", priority = 8)
    @Description("POST /posts - create post with JavaFaker data")
    public void testCreatePostWithFaker() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.POSTS_URL)
                .body(payloadManager.createPostPayloadFaker())
                .when()
                .post();

        validatableResponse = response.then();
        validatableResponse.statusCode(201);

        Post post = payloadManager.postFromJson(response.asString());
        assertActions.verifyStringKeyNotNull(post.getId());
        assertActions.verifyStringKeyNotNull(post.getTitle());
    }
}
