import React, {
  Component
} from 'react';

import {
  observer,
  inject
} from 'mobx-react/native'

import {
  Text,
  ScrollView,
  ListView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

import WalletOverviewView from './WalletOverviewView';
import WalletBalanceTokens from './balances/WalletBalanceTokens';

import FeaturesService from '../common/services/features.service';

/**
 * Wallet screen
 */
@inject('wallet', 'user', 'tabs', 'navigatorStore')
@observer
export default class WalletScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: (
    <View style={{ flexDirection: 'row', paddingRight:10}}>
      {/*<IonIcon name="ios-card" size={18} color='#444' style={{paddingRight: 10}} onPress={() => navigation.navigate('NotificationsSettings')} />
      <Text>PURCHASE</Text>*/}
    </View>
    )
  });

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <CIcon name="bank" size={24} color={tintColor} />
    )
  }

  componentWillMount() {
    this.disposeState = this.props.tabs.onState((state) => {
      if (!state.previousScene) return;
      if (state.previousScene.key == "Wallet" && state.previousScene.key == state.scene.route.key) {
        this.props.wallet.refresh();
      }
    });
    this.disposeEnter = this.props.navigatorStore.onEnterScreen('Wallet', async () => {
      if ((await this.props.wallet.canShowOnboarding()) && (!this.props.user.hasRewards() || !this.props.user.hasEthWallet())) {
        setImmediate(() => {
          this.props.navigation.navigate('WalletOnboarding');
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.disposeEnter)
      this.disposeEnter();
  }

  render() {
    return (
      <ScrollView style={ styles.mainContainer }>
        {FeaturesService.has('crypto') && <WalletBalanceTokens />}

        <View>

          <TouchableOpacity style={styles.itemContainer} onPress={ () => this.props.navigation.navigate('BoostConsole') }>
            <View style={styles.iconContainer}>
              <Icon name="trending-up" size={24} style={ styles.icon } />
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>Boost Console</Text>
              <Text style={styles.subtitle}>Accept or reject boosts made to you</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemContainer} onPress={ () => this.props.navigation.navigate('Transactions')} >
            <View style={styles.iconContainer}>
              <Icon name="history" size={24} style={ styles.icon } />
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>Transactions</Text>
              <Text style={styles.subtitle}>A list of transactions you have made with your addresses</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemContainer} onPress={ () => this.props.navigation.navigate('Withdraw')} >
            <View style={styles.iconContainer}>
              <Icon name="local-atm" size={24} style={ styles.icon } />
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>Withdraw</Text>
              <Text style={styles.subtitle}>Request withdrawal of your token rewards to your OnChain wallet.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemContainer} onPress={ () => this.props.navigation.navigate('Contributions')} >
            <View style={styles.iconContainer}>
              <Icon name="stars" size={24} style={ styles.icon } />
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>Contributions</Text>
              <Text style={styles.subtitle}>Check and rewards and daily contribution scores</Text>
            </View>
          </TouchableOpacity>

          {FeaturesService.has('crypto') && <TouchableOpacity style={styles.itemContainer} onPress={ () => this.props.navigation.navigate('BlockchainWallet') }>
            <View style={styles.iconContainer}>
              <Icon name="settings" size={24} style={ styles.icon } />
            </View>
            <View style={styles.item}>
              <Text style={styles.title}>Addresses</Text>
              <Text style={styles.subtitle}>Configure your crypto addresses and other token related settings</Text>
            </View>
          </TouchableOpacity>}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  detail: {
    paddingTop: 0,
    fontSize: 13,
    paddingTop: 20,
    color: '#888',
  },
  iconContainer: {
    width: 36,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  icon: {
    color: '#455a64',
  },
  points: {
    paddingTop: 20,
    color: 'green',
    paddingTop: 0,
    fontSize: 35,
  },
  title: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#444',
  },
  subtitle: {
    fontSize: 12,
    color: '#888'
  },
  itemContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  item: {
    flex: 1,
  },
  datailsContainer: {
    padding: 16,
  },
  mainContainer: {
    backgroundColor: '#fff'
  }
});
