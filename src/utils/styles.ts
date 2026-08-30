import { StyleSheet } from 'react-native';

// ============================================================
// Shared Styles
// ============================================================

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  // Player
  playerPanel: {
    flex: 1,
    backgroundColor: '#000',
  },

  playerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  playerWrapper: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden',
  },

  video: {
    width: '100%',
    height: '100%',
  },

  bandwidthBadge: {
    position: 'absolute',
    top: 18,
    right: 18,
    minWidth: 92,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(8, 12, 18, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    zIndex: 20,
    elevation: 6,
  },

  bandwidthText: {
    color: '#eaf4ff',
    fontSize: 12,
    fontWeight: '700',
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    zIndex: 15,
  },

  loadingText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },

  // Channel Banner
  channelBanner: {
    position: 'absolute',
    left: '12%',
    right: '12%',
    bottom: 28,
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(8, 12, 18, 0.58)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    zIndex: 10,
    elevation: 5,
  },

  channelBannerMain: {
    flex: 1,
    minWidth: 0,
    paddingRight: 24,
  },

  channelBannerName: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '800',
  },

  channelBannerGroup: {
    color: '#aeb8c7',
    fontSize: 12,
    marginTop: 5,
  },

  channelBannerSource: {
    minWidth: 140,
    maxWidth: '35%',
    alignItems: 'flex-end',
    paddingLeft: 20,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.12)',
  },

  channelBannerSourceLabel: {
    color: '#8f9bad',
    fontSize: 10,
    marginBottom: 4,
  },

  channelBannerSourceText: {
    color: '#8bc5ff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Drawer
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    zIndex: 100,
  },

  drawerPanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '50%',
    minWidth: 560,
    maxWidth: 900,
    backgroundColor: '#0b1017',
    borderRightWidth: 2,
    borderRightColor: '#3478bd',
    elevation: 20,
  },

  drawerHeader: {
    height: 110,
    paddingHorizontal: 32,
    paddingVertical: 22,
    justifyContent: 'center',
    backgroundColor: '#10161f',
    borderBottomWidth: 1,
    borderBottomColor: '#1d2633',
  },

  drawerTitle: {
    color: '#e8edf5',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },

  drawerHint: {
    color: '#69778b',
    fontSize: 13,
  },

  drawerBody: {
    flex: 1,
    flexDirection: 'row',
  },

  groupColumn: {
    width: '35%',
    backgroundColor: '#090e14',
    borderRightWidth: 1,
    borderRightColor: '#26313f',
  },

  channelColumn: {
    flex: 1,
    backgroundColor: '#0c1118',
  },

  columnHeader: {
    height: 66,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: '#101923',
    borderBottomWidth: 1,
    borderBottomColor: '#26313f',
  },

  columnHeaderActive: {
    backgroundColor: '#13263b',
  },

  columnHeaderLeft: {
    flex: 1,
    minWidth: 0,
  },

  columnHeaderText: {
    color: '#748297',
    fontSize: 16,
    fontWeight: '700',
  },

  columnHeaderTextActive: {
    color: '#8bc5ff',
  },

  columnHeaderCount: {
    color: '#5e6c7e',
    fontSize: 13,
    marginLeft: 12,
  },

  // Group Item
  groupItem: {
    height: 54,
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: '#090e14',
    borderBottomWidth: 1,
    borderBottomColor: '#151e28',
  },

  groupItemFocused: {
    backgroundColor: '#17304a',
  },

  groupItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 20,
  },

  groupName: {
    flex: 1,
    color: '#8b96a7',
    fontSize: 14,
    fontWeight: '600',
  },

  groupNameFocused: {
    color: '#fff',
    fontWeight: '800',
  },

  groupCount: {
    color: '#4d5a6b',
    fontSize: 11,
    marginLeft: 10,
  },

  // Channel Item
  channelMenuItem: {
    height: 64,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#0c1118',
    borderBottomWidth: 1,
    borderBottomColor: '#151e28',
  },

  channelMenuItemFocused: {
    backgroundColor: '#17304a',
  },

  channelNumber: {
    width: 34,
    height: 34,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#182331',
    marginRight: 16,
  },

  channelNumberText: {
    color: '#5d6a7c',
    fontSize: 12,
    fontWeight: '700',
  },

  channelNumberTextFocused: {
    color: '#9ed0ff',
  },

  channelMenuInfo: {
    flex: 1,
    minWidth: 0,
  },

  channelMenuName: {
    color: '#9ba5b4',
    fontSize: 15,
    fontWeight: '500',
  },

  channelMenuNameFocused: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },

  channelMenuSource: {
    color: '#4d5969',
    fontSize: 10,
    marginTop: 4,
  },

  cursorBar: {
    position: 'absolute',
    left: 0,
    top: 5,
    bottom: 5,
    width: 4,
    borderRadius: 2,
    backgroundColor: '#5ba8ff',
    zIndex: 10,
  },

  emptyDrawer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyDrawerText: {
    color: '#667386',
    fontSize: 16,
  },

  // Splash
  splashRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#05080d',
  },

  splashLogoWrap: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  splashLogo: {
    width: 200,
    height: 200,
  },

  splashTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },

  splashSubtitle: {
    color: '#8b96a7',
    fontSize: 14,
    marginBottom: 36,
  },

  splashProgressTrack: {
    width: 220,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },

  splashProgressBar: {
    width: '70%',
    height: '100%',
    backgroundColor: '#5ba8ff',
  },

  splashStatus: {
    color: '#5e6c7e',
    fontSize: 12,
    marginTop: 16,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07090d',
  },

  placeholderText: {
    color: '#697487',
    fontSize: 18,
    fontWeight: '500',
  },
});
