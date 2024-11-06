$(document).ready(function () {

    const $form = $('form');

    $form.on('submit', function (event) {
        event.preventDefault();

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
            },
            error: function (xhr, status, error) {
                console.error('AJAX error:', status, error);
            }
        })
    })


const createTweetElement = function(tweet) {
    console.log("Creating tweet for:", tweet)
    const { user, content, created_at } = tweet;
    const timeAgo = new Date(created_at).toLocaleString();

    const $tweet = $(`
    <article class="tweet">
      <header>
        <div>
          <img src="${user.avatars}" alt="User Avatar" class="avatar">
          <strong>${user.name}</strong>
        </div>
        <span>${user.handle}</span>
      </header>
      <p>${content.text}</p>
      <footer>
        <span>${timeAgo}</span>
        <div class="icons">
          <i class="fa-solid fa-flag"></i>
          <i class="fa-solid fa-retweet"></i>
          <i class="fa-solid fa-heart"></i>
        </div>
      </footer>
    </article>
  `);

    return $tweet;
};

const renderTweets = function(tweets) {
    console.log("Rendering tweets");
    const $tweetsContainer = $('.tweet-container');
    $tweetsContainer.empty();

    for (const tweet of tweets) {
        const $tweet = createTweetElement(tweet);
        $tweetsContainer.append($tweet);
    }
};

const testData = [
    {
        "user": {
            "name": "Newton",
            "avatars": "https://i.imgur.com/73hZDYK.png",
            "handle": "@SirIsaac"
        },
        "content": {
            "text": "If I have seen further it is by standing on the shoulders of giants"
        },
        "created_at": 1730749431693
    },
    {
        "user": {
            "name": "Descartes",
            "avatars": "https://i.imgur.com/nlhLi3I.png",
            "handle": "@rd"
        },
        "content": {
            "text": "Je pense , donc je suis"
        },
        "created_at": 1730835831693
    }
];

renderTweets(testData);
});