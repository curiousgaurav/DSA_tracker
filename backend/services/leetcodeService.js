const axios = require('axios');

const LEETCODE_API = 'https://leetcode.com/graphql';

// Headers required by LeetCode
const headers = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
};

/**
 * Fetch all LeetCode problems using GraphQL API
 * @param {number} limit - Number of problems to fetch per request
 * @param {number} offset - Starting offset
 * @returns {Promise<Array>} Array of problems
 */
exports.fetchLeetCodeProblems = async (limit = 50, offset = 0) => {
  try {
    const query = `
      query getQuestions($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: data {
            questionFrontendId
            questionId
            title
            titleSlug
            difficulty
            topicTags {
              name
              slug
            }
          }
        }
      }
    `;

    const variables = {
      categorySlug: "",
      skip: offset,
      limit: limit,
      filters: {}
    };

    const response = await axios.post(LEETCODE_API, {
      query,
      variables
    }, { headers, timeout: 10000 });

    if (response.data.errors) {
      console.error('LeetCode API Error:', response.data.errors);
      throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
    }

    return response.data.data.questionList;
  } catch (error) {
    console.error('Error fetching LeetCode problems:', error.message);
    if (error.response?.data) {
      console.error('API Response:', error.response.data);
    }
    throw error;
  }
};

/**
 * Fetch a single problem details
 * @param {string} slug - Problem slug/title slug
 * @returns {Promise<Object>} Problem details
 */
exports.fetchProblemDetails = async (slug) => {
  try {
    const query = `
      query getQuestionDetail($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          questionFrontendId
          title
          titleSlug
          content
          difficulty
          topicTags {
            name
            slug
          }
          codeSnippets {
            lang
            code
          }
          similar {
            questionFrontendId
            title
            titleSlug
            difficulty
          }
        }
      }
    `;

    const response = await axios.post(LEETCODE_API, {
      query,
      variables: { titleSlug: slug }
    }, { headers });

    if (response.data.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
    }

    return response.data.data.question;
  } catch (error) {
    console.error(`Error fetching problem details for ${slug}:`, error.message);
    throw error;
  }
};

/**
 * Get all problems with pagination
 * @returns {Promise<Array>} All problems
 */
exports.getAllProblems = async () => {
  try {
    const allProblems = [];
    let offset = 0;
    const limit = 50; // LeetCode's limit per request
    let hasMore = true;

    console.log('🔄 Starting to fetch all LeetCode problems...');

    while (hasMore) {
      console.log(`📥 Fetching problems offset: ${offset}`);
      
      const result = await exports.fetchLeetCodeProblems(limit, offset);
      
      if (result.questions && result.questions.length > 0) {
        allProblems.push(...result.questions);
        offset += limit;

        // Stop if we've fetched all problems
        if (allProblems.length >= result.total) {
          hasMore = false;
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        hasMore = false;
      }
    }

    console.log(`✅ Successfully fetched ${allProblems.length} problems`);
    return allProblems;
  } catch (error) {
    console.error('Error fetching all problems:', error.message);
    throw error;
  }
};

/**
 * Fetch problems by difficulty
 * @param {string} difficulty - 'Easy', 'Medium', 'Hard'
 * @returns {Promise<Array>} Problems of specified difficulty
 */
exports.getProblemsByDifficulty = async (difficulty) => {
  try {
    // Convert to uppercase for LeetCode API (EASY, MEDIUM, HARD)
    const upperDifficulty = difficulty.toUpperCase();
    
    const query = `
      query getQuestions($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: data {
            questionFrontendId
            questionId
            title
            titleSlug
            difficulty
            topicTags {
              name
              slug
            }
          }
        }
      }
    `;

    const variables = {
      categorySlug: "",
      skip: 0,
      limit: 50,
      filters: { difficulty: upperDifficulty }
    };

    const response = await axios.post(LEETCODE_API, {
      query,
      variables
    }, { headers, timeout: 10000 });

    if (response.data.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
    }

    return response.data.data.questionList;
  } catch (error) {
    console.error('Error fetching problems by difficulty:', error.message);
    if (error.response?.data) {
      console.error('API Response:', error.response.data);
    }
    throw error;
  }
};

/**
 * Fetch problems by tag
 * @param {string} tag - Topic tag (e.g., 'array', 'dynamic-programming')
 * @returns {Promise<Array>} Problems with specified tag
 */
exports.getProblemsByTag = async (tag) => {
  try {
    const query = `
      query getQuestions($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: data {
            questionFrontendId
            questionId
            title
            titleSlug
            difficulty
            topicTags {
              name
              slug
            }
          }
        }
      }
    `;

    const variables = {
      categorySlug: "",
      skip: 0,
      limit: 50,
      filters: { tags: [tag] }
    };

    const response = await axios.post(LEETCODE_API, {
      query,
      variables
    }, { headers, timeout: 10000 });

    if (response.data.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(response.data.errors)}`);
    }

    return response.data.data.questionList;
  } catch (error) {
    console.error('Error fetching problems by tag:', error.message);
    if (error.response?.data) {
      console.error('API Response:', error.response.data);
    }
    throw error;
  }
};
