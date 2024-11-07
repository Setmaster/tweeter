class Tweet {
    constructor(user, content, createdAt) {
        this.user = user;
        this.content = content;
        this.createdAt = createdAt;
    }

    getFormattedTime() {
        return timeago.format(this.createdAt);
    }

    toHTML() {
        return `
            <article class="tweet">
                <header>
                    <div>
                        <img src="${this.user.avatars}" alt="User Avatar" class="avatar">
                        <strong>${this.user.name}</strong>
                    </div>
                    <span>${this.user.handle}</span>
                </header>
                <p>${this.content.text}</p>
                <footer>
                    <span>${this.getFormattedTime()}</span>
                    <div class="icons">
                        <i class="fa-solid fa-flag"></i>
                        <i class="fa-solid fa-retweet"></i>
                        <i class="fa-solid fa-heart"></i>
                    </div>
                </footer>
            </article>
        `;
    }
}

// validates the content of the tweet
const validateTweet = function (tweetContent) {
    if (tweetContent === "") {
        return "Your tweet's content is empty! Please write something before submitting.";
    }

    if (tweetContent.length > 140) {
        return `Your tweet is too long! Please keep your tweet under ${140} characters.`;
    }

    return null; // No errors, validation passed
}
$(document).ready(function () {
    const $form = $('form');
    const $errorAlert = $('#error-alert');
    
    $form.on('submit', function (event) {
        event.preventDefault();

        // reset error alert on submit
        $errorAlert.slideUp();
        
        const $tweetText = $('#tweet-text');
        const tweetContent = $tweetText.val().trim(); // trim whitepsace

        //validation
        const errorMessage = validateTweet(tweetContent);
        if (errorMessage){
            $errorAlert.text(errorMessage).slideDown();
            return;
        }
        
        // we only serialize after validation passes
        const formData = $(this).serialize();
        
        $.ajax({
            type: 'POST',
            url: '/tweets',
            data: formData,
            success: function (response) {
                console.log('Server response:', response);

                // reset input
                $('#tweet-text').val('');
                $('.counter').text(140);

                // reload tweets after a new one is made
                loadTweets();
            },
            error: function (xhr, status, error) {
                console.error('AJAX error:', status, error);
            }
        });
    });

    const loadTweets = function () {
        $.ajax({
            url: '/tweets',
            method: 'GET',
            dataType: 'json',
            success: function (tweets) {
                console.log('Tweets loaded:', tweets);
                renderTweets(tweets);
            },
            error: function (xhr, status, error) {
                console.error('Failed to load tweets:', status, error);
            }
        });
    };

    const createTweetElement = function (tweetData) {
        console.log("Creating tweet for:", tweetData);
        const tweet = new Tweet(tweetData.user, tweetData.content, tweetData.created_at);
        return $(tweet.toHTML());
    };

    const renderTweets = function (tweets) {
        console.log("Rendering tweets");
        const $tweetsContainer = $('.tweet-container');
        // reset container so don't end up with duplicates
        $tweetsContainer.empty();

        for (const tweet of tweets) {
            const $tweet = createTweetElement(tweet);
            $tweetsContainer.prepend($tweet);
        }
    };

    loadTweets();
});
