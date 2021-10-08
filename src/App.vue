<template>
  <div class="max-w-7xl mx-auto py-3 2xl:px-0 px-4 lg:px-12">
    <div class="text-center font-bold text-4xl">Country Information</div>
    <template v-if="!loading">
      <div v-if="!selectedCountry">
        <SearchBar
          v-model="countrySearchTerm"
          class="mb-3 mt-4"
          placeholder="Search for a country"
        />
        <browse-wrapper title="Select a country">
          <BrowseCard
            v-for="country in filteredSet({
              term: countrySearchTerm,
              arr: countries,
              key: 'country_name',
            })"
            :key="country.country_name"
            @click="setCountry(country)"
          >
            <span class="text-3xl block">{{ country.country_short_name }}</span>
            <span class="block">{{ country.country_name }}</span>
            <span class="block">{{ country.country_phone_code }}</span>
          </BrowseCard>
        </browse-wrapper>
      </div>
      <div v-else-if="selectedCountry && !selectedState">
        <SearchBar
          v-model="stateSearchTerm"
          class="mb-3 mt-4"
          placeholder="Search for a state"
        />
        <GoBackButton @click=";(selectedCountry = ''), (states = [])" />
        <browse-wrapper title="Select a state">
          <BrowseCard
            v-for="state in filteredSet({
              term: stateSearchTerm,
              arr: states,
              key: 'state_name',
            })"
            :key="state.state_name"
            @click="setState(state)"
          >
            <span class="block">{{ state.state_name }}</span>
          </BrowseCard>
        </browse-wrapper>
      </div>
      <div v-else-if="selectedState">
        <SearchBar
          v-model="citySearchTerm"
          class="mb-3 mt-4"
          placeholder="Search for a city"
        />
        <GoBackButton
          @click=";(selectedState = ''), (cities = []), (selectedCities = [])"
        />
        <browse-wrapper title="Select Cities">
          <template #top>
            <button
              class="
                px-6
                py-2
                bg-black
                text-white
                rounded-md
                hover:bg-opacity-75
                duration-150
                mb-4
                text-xl
                flex
                items-center
                gap-x-2
                inline-block
                mx-auto
              "
              @click="toggleSelectAll()"
            >
              {{ selectedAllCities ? 'Unselect all' : 'Select all' }}
            </button>
          </template>
          <BrowseCard
            v-for="city in filteredSet({
              term: citySearchTerm,
              arr: cities,
              key: 'city_name',
            })"
            :key="city.city_name"
            :is-selected="!!selectedCities.find((c) => city.city_name === c)"
            @click="setSelectedCity(city)"
          >
            <span class="block">{{ city.city_name }}</span>
          </BrowseCard>
        </browse-wrapper>
      </div>
    </template>
    <template v-else>
      <div class="flex justify-center mt-4">
        <div>
          <Spinner />
          <p>Loading...</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { accessTokenName, accessTokenHeaders } from '@/constants'
import Spinner from '@/components/Spinner.vue'
import BrowseWrapper from '@/components/BrowseWrapper.vue'
import BrowseCard from '@/components/BrowseCard.vue'
import GoBackButton from '@/components/GoBackButton.vue'
import SearchBar from '@/components/SearchBar.vue'
export default {
  components: {
    Spinner,
    BrowseWrapper,
    BrowseCard,
    GoBackButton,
    SearchBar,
  },
  data() {
    return {
      selectedCountry: '',
      selectedState: '',
      citySearchTerm: '',
      countrySearchTerm: '',
      stateSearchTerm: '',
      countries: [],
      states: [],
      cities: [],
      selectedCities: [],
      loading: true,
    }
  },
  computed: {
    selectedAllCities() {
      const cityNames = this.cities.map((c) => c.city_name)
      // if ones missing this will break the loop and return true
      const foundMissing = cityNames.some((ct) => {
        if (!this.selectedCities.includes(ct)) {
          return true
        }
      })
      // if a city is missing, the above function returns true and if none are missing it returns false so we need to inverse to make this computed value make sense
      return !foundMissing
    },
  },
  async mounted() {
    let accessToken = this.$cookies.get(accessTokenName)
    if (!accessToken) {
      try {
        const {
          data: { auth_token: fetchedAccessToken },
        } = await this.$axios.get('/getaccesstoken', {
          headers: accessTokenHeaders,
        })
        this.$cookies.set(accessTokenName, fetchedAccessToken)
        accessToken = fetchedAccessToken
      } catch (error) {
        alert('Something went wrong when creating API token.')
      }
    }
    this.$axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${accessToken}`
    try {
      this.loading = true
      const { data } = await this.$axios.get('/countries')
      this.countries = data
    } catch (error) {
      alert('Something went fetching countries')
    } finally {
      this.loading = false
    }
  },
  methods: {
    filteredSet({ term, arr, key }) {
      if (!term) return arr
      return arr.filter((item) =>
        item[key].toLowerCase().includes(term.toLowerCase())
      )
    },
    toggleSelectAll() {
      if (this.selectedAllCities) {
        this.selectedCities = []
      } else {
        this.selectedCities = this.cities.map((c) => c.city_name)
      }
    },
    setSelectedCity(city) {
      const alreadySelected = this.selectedCities.find(
        (c) => c === city.city_name
      )
      if (alreadySelected) {
        this.selectedCities = this.selectedCities.filter(
          (ct) => ct !== city.city_name
        )
      } else {
        this.selectedCities = [...this.selectedCities, city.city_name]
      }
    },
    async setCountry({ country_name: country }) {
      // reset search term so it isn't set to previous term
      this.stateSearchTerm = ''
      this.selectedCountry = country
      this.loading = true
      try {
        const { data } = await this.$axios.get(
          `https://www.universal-tutorial.com/api/states/${this.selectedCountry}`
        )
        this.states = data
      } catch (error) {
        alert(`Something went wrong fetching states for ${country}`)
      } finally {
        this.loading = false
      }
    },
    async setState({ state_name: state }) {
      // reset search term so it isn't set to previous term
      this.citySearchTerm = ''
      this.selectedState = state
      this.loading = true
      try {
        const { data } = await this.$axios.get(
          `https://www.universal-tutorial.com/api/cities/${this.selectedState}`
        )
        this.cities = data
      } catch (error) {
        alert(`Something went wrong fetching states for ${state}`)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style></style>
