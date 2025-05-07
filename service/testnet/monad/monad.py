from service.testnet.monad.shmonad import run_shmonad
from service.web3 import get_private_key
from service.util import get_requests_proxy


class Monad:
    def run_shmonad(self, name, proxy=None):
        private_key = get_private_key(name)
        proxy = get_requests_proxy(name)
        run_shmonad(private_key, proxy=proxy)
