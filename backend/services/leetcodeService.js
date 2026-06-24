import axios from 'axios';

const LEETCODE_API_URL = 'https://leetcode.com/graphql';

export const getLeetCodeStats = async (username) => {
  try {
    const query = `
      query getUserProfile($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          username
          githubUrl
          twitterUrl
          linkedinUrl
          profile {
            ranking
            userAvatar
            realName
            aboutMe
            school
            countryName
            company
            jobTitle
            skillTags
          }
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          topPercentage
        }
      }
    `;

    const variables = { username };

    const res = await axios.post(LEETCODE_API_URL, { query, variables }, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      }
    });

    if (res.data.errors) {
      throw new Error(res.data.errors[0].message);
    }

    const { matchedUser, allQuestionsCount, userContestRanking } = res.data.data;

    if (!matchedUser) {
      return { success: false, message: 'LeetCode user not found' };
    }

    // Process submission stats
    const totalSolved = matchedUser.submitStats.acSubmissionNum.find(s => s.difficulty === 'All')?.count || 0;
    const easySolved = matchedUser.submitStats.acSubmissionNum.find(s => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = matchedUser.submitStats.acSubmissionNum.find(s => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = matchedUser.submitStats.acSubmissionNum.find(s => s.difficulty === 'Hard')?.count || 0;

    return {
      success: true,
      data: {
        username: matchedUser.username,
        realName: matchedUser.profile.realName,
        avatar: matchedUser.profile.userAvatar,
        ranking: matchedUser.profile.ranking,
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        contestRating: userContestRanking ? Math.round(userContestRanking.rating) : null,
        attendedContests: userContestRanking ? userContestRanking.attendedContestsCount : 0,
        globalRanking: userContestRanking ? userContestRanking.globalRanking : null,
        topPercentage: userContestRanking ? userContestRanking.topPercentage : null,
      }
    };
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error.message);
    return {
      success: false,
      message: 'Failed to fetch LeetCode data'
    };
  }
};
