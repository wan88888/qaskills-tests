package com.qaskills.jsonplaceholder.tests.crud;

import com.qaskills.jsonplaceholder.base.BaseTest;
import com.qaskills.jsonplaceholder.endpoints.APIConstants;
import com.qaskills.jsonplaceholder.pojos.request.Post;
import com.qaskills.jsonplaceholder.pojos.request.Todo;
import com.qaskills.jsonplaceholder.pojos.response.User;
import io.qameta.allure.Description;
import io.qameta.allure.Owner;
import io.restassured.RestAssured;
import org.testng.annotations.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class TestUsersRead extends BaseTest {

    @Test(groups = "reg", priority = 1)
    @Owner("qaskills")
    @Description("GET /users/1 - retrieve user profile")
    public void testGetUserById() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.USERS_URL + "/1")
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);

        User user = payloadManager.userFromJson(response.asString());
        assertActions.verifyResponseBody(user.getId(), 1, "user id");
        assertActions.verifyStringKey(user.getUsername(), "Bret");
        assertActions.verifyStringKeyNotNull(user.getAddress().getCity());
        assertActions.verifyStringKeyNotNull(user.getCompany().getName());
    }

    @Test(groups = "reg", priority = 2)
    @Description("GET /users/1/posts - nested posts for user")
    public void testGetUserPosts() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.USERS_URL + "/1/posts")
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);

        List<Post> posts = payloadManager.postListFromJson(response.asString());
        assertThat(posts).isNotEmpty();
        assertThat(posts).allMatch(post -> post.getUserId().equals(1));
    }

    @Test(groups = "reg", priority = 3)
    @Description("GET /users/1/todos - nested todos for user")
    public void testGetUserTodos() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.USERS_URL + "/1/todos")
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);

        List<Todo> todos = payloadManager.todoListFromJson(response.asString());
        assertThat(todos).isNotEmpty();
        assertThat(todos).allMatch(todo -> todo.getUserId().equals(1));
    }
}
