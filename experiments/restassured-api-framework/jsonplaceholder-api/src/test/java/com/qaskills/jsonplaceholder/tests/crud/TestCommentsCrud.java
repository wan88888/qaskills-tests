package com.qaskills.jsonplaceholder.tests.crud;

import com.qaskills.jsonplaceholder.base.BaseTest;
import com.qaskills.jsonplaceholder.endpoints.APIConstants;
import com.qaskills.jsonplaceholder.pojos.request.Comment;
import io.qameta.allure.Description;
import io.qameta.allure.Owner;
import io.restassured.RestAssured;
import org.testng.annotations.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class TestCommentsCrud extends BaseTest {

    @Test(groups = "reg", priority = 1)
    @Owner("qaskills")
    @Description("GET /comments?postId=1 - filter comments by post")
    public void testGetCommentsByPostId() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.COMMENTS_URL)
                .queryParam("postId", 1)
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);

        List<Comment> comments = payloadManager.commentListFromJson(response.asString());
        assertThat(comments).isNotEmpty();
        assertThat(comments).allMatch(comment -> comment.getPostId().equals(1));
    }

    @Test(groups = "reg", priority = 2)
    @Description("GET /comments/1 - retrieve single comment")
    public void testGetCommentById() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.COMMENTS_URL + "/1")
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);

        Comment comment = payloadManager.commentFromJson(response.asString());
        assertActions.verifyResponseBody(comment.getId(), 1, "comment id");
        assertActions.verifyStringKeyNotNull(comment.getEmail());
    }

    @Test(groups = "reg", priority = 3)
    @Description("POST /comments - create comment")
    public void testCreateComment() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.COMMENTS_URL)
                .body(payloadManager.createCommentPayloadAsString())
                .when()
                .post();

        validatableResponse = response.then();
        validatableResponse.statusCode(201);

        Comment comment = payloadManager.commentFromJson(response.asString());
        assertActions.verifyResponseBody(comment.getId(), 501, "created comment id");
        assertActions.verifyStringKey(comment.getEmail(), "tester@example.com");
    }
}
